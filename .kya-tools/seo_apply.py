#!/usr/bin/env python3
"""Apply SEO metadata (title, description, og:, twitter:, canonical, robots, JSON-LD)
to all KYA pages. Uses seo-meta.json as source of truth.

The harness already has REPLACE_TITLE, REPLACE_META, INJECT_HEAD. This script
orchestrates them per page.
"""
import sys, os, subprocess, json, re

HERE = os.path.dirname(os.path.abspath(__file__))
HARNESS = os.path.join(HERE, 'bundle_edit.py')
SITE_ROOT = os.path.dirname(HERE)

def run(args, check=True):
    return subprocess.run(['python3', HARNESS] + args, capture_output=True, text=True, check=check)

def build_head_block(page_key, cfg, og_image, canonical_base):
    """Build the full SEO <head> block for one page."""
    title = cfg['title']
    desc = cfg['description']
    og_title = cfg.get('og_title', title)
    og_desc = cfg.get('og_description', desc)
    og_type = cfg.get('og_type', 'website')
    url_path = cfg['url_path']
    canonical = canonical_base + url_path
    robots = cfg.get('robots', 'index, follow')

    # JSON-LD Organization (for index) or WebPage (for others)
    if page_key == 'index':
        ld = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AEOESS",
            "url": "https://aeoess.com",
            "logo": "https://aeoess.com/assets/images/aeoess_logo-05.png",
            "description": desc,
            "sameAs": [
                "https://agent-passport.org",
                "https://github.com/aeoess",
                "https://www.npmjs.com/package/agent-passport-system",
                "https://pypi.org/project/agent-passport-system/"
            ]
        }
    else:
        ld = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": og_title,
            "description": desc,
            "url": canonical,
            "isPartOf": {"@type": "WebSite", "name": "AEOESS", "url": "https://aeoess.com"},
            "publisher": {"@type": "Organization", "name": "AEOESS", "url": "https://aeoess.com"}
        }

    # FAQ page gets an extra FAQPage schema — too verbose to inline here; skipping for v1.

    ld_json = json.dumps(ld, separators=(',', ':'))

    return f"""  <meta name="description" content="{desc}">
  <link rel="canonical" href="{canonical}">
  <meta name="robots" content="{robots}">
  <meta property="og:title" content="{og_title}">
  <meta property="og:description" content="{og_desc}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{og_image}">
  <meta property="og:site_name" content="AEOESS">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{og_title}">
  <meta name="twitter:description" content="{og_desc}">
  <meta name="twitter:image" content="{og_image}">
  <script type="application/ld+json">{ld_json}</script>
  <!-- agent pointer: machine-readable site context at /llms.txt and /llms-full.txt -->
  <link rel="alternate" type="text/plain" title="LLM-readable site context" href="/llms-full.txt">"""

def main():
    seo = json.load(open(os.path.join(HERE, 'seo-meta.json')))
    og_image = seo['_og_image_default']
    canonical_base = seo['_canonical_base']

    results = []
    for page_key, cfg in seo.items():
        if page_key.startswith('_'): continue
        path = os.path.join(SITE_ROOT, f'{page_key}.html')
        if not os.path.exists(path):
            print(f'  {page_key}: MISSING'); continue

        # 1. Update title
        run(['REPLACE_TITLE', path, cfg['title']])

        # 2. Inject full SEO head block
        head_block = build_head_block(page_key, cfg, og_image, canonical_base)
        run(['INJECT_HEAD', path, head_block])

        # 3. Verify integrity
        ig = run(['CHECK_INTEGRITY', path], check=False)
        ok = 'ok, 0 bad' in ig.stdout
        results.append((page_key, ok))
        print(f'  {page_key:18}  title+meta+jsonld  [{"OK" if ok else "FAIL"}]')

    print(f'\nSEO metadata applied to {len(results)} pages')
    print(f'integrity-clean: {sum(1 for _,ok in results if ok)} / {len(results)}')

if __name__ == '__main__': main()
