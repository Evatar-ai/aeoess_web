"""Inject canonical OG/Twitter/description meta tags into the STATIC head
section of each .html file, so crawlers (Telegram, Facebook, Twitter, Discord,
Google) see them before any JS runs.

Replaces the static <title> too. Idempotent.
"""
import json, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, '.kya-tools/seo-meta.json')) as f:
    META = json.load(f)

OG_IMAGE = META['_og_image_default']
CANON = META['_canonical_base']

# Marker comments to make this section idempotent
MARK_START = '<!-- KYA-SEO-STATIC-BEGIN -->'
MARK_END   = '<!-- KYA-SEO-STATIC-END -->'

def render_block(entry):
    title    = entry['title']
    desc     = entry['description']
    og_t     = entry.get('og_title', title)
    og_d     = entry.get('og_description', desc)
    og_type  = entry.get('og_type', 'website')
    path     = entry.get('url_path', '/')
    url      = CANON + path
    
    return f"""  {MARK_START}
  <meta name="description" content="{desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:url" content="{url}">
  <meta property="og:title" content="{og_t}">
  <meta property="og:description" content="{og_d}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:site_name" content="AEOESS">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{og_t}">
  <meta name="twitter:description" content="{og_d}">
  <meta name="twitter:image" content="{OG_IMAGE}">
  {MARK_END}"""

def inject(page_key):
    if page_key.startswith('_'): return None
    entry = META[page_key]
    fname = 'index.html' if page_key == 'index' else f'{page_key}.html'
    path = os.path.join(ROOT, fname)
    if not os.path.exists(path): return None
    
    with open(path) as f: s = f.read()
    orig = s
    
    block = render_block(entry)
    
    # 1. Replace the static <title> with new title (only the FIRST <title> tag — that's the static one)
    title_pattern = re.compile(r'<title>[^<]*</title>')
    title_match = title_pattern.search(s)
    if title_match:
        # Only replace if it's in the static head (before the first <script>)
        first_script = s.find('<script')
        if title_match.start() < first_script:
            s = s[:title_match.start()] + f'<title>{entry["title"]}</title>' + s[title_match.end():]
    
    # 2. Strip any previous KYA-SEO-STATIC block (idempotent re-run)
    s = re.sub(
        re.escape(MARK_START) + r'.*?' + re.escape(MARK_END),
        '',
        s, flags=re.DOTALL)
    # Also strip empty lines left behind
    s = re.sub(r'\n\s*\n\s*\n', '\n\n', s)
    
    # 3. Insert the block right after the <title> in the static head
    title2 = title_pattern.search(s)
    if title2:
        insert_pos = title2.end()
        s = s[:insert_pos] + '\n' + block + s[insert_pos:]
    
    if s != orig:
        with open(path, 'w') as f: f.write(s)
        return True
    return False

changed = []
for page_key in META:
    result = inject(page_key)
    if result is True:
        changed.append(page_key)

print(f'static SEO injected into {len(changed)} pages:')
for p in changed: print(f'  {p}')
