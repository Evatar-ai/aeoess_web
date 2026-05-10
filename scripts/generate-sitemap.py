#!/usr/bin/env python3
"""
Generate sitemap.xml from the public HTML pages on disk.

Reads file mtime for <lastmod>, classifies pages by category for <priority>,
excludes non-public pages explicitly.

Run: python3 scripts/generate-sitemap.py
"""
import os
import sys
from datetime import datetime
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
BASE = "https://aeoess.com"

# Pages that exist on disk but should NOT be in the sitemap
EXCLUDE = {
    "404.html",            # error page; Google ignores anyway
    "embed-host-preview.html",  # preview / dev artifact
    "welcome.html",        # onboarding flow, not a destination URL
    "sitemap.html",        # UI version, not a crawl target
}

# Priority by category. Higher = more important to surface in search results.
PRIORITY_HIGH = {  # 1.0 / 0.9 — top-tier landing surfaces
    "index.html":            ("1.0", "weekly"),
    "opensource.html":       ("0.9", "daily"),
    "research.html":         ("0.9", "weekly"),
    "media.html":            ("0.9", "weekly"),
    "passport.html":         ("0.9", "weekly"),
    "blog.html":             ("0.8", "daily"),
}
PRIORITY_MID = {   # 0.7 / 0.6 — supporting product / docs surfaces
    "architecture.html":     ("0.7", "weekly"),
    "compare.html":          ("0.7", "weekly"),
    "compliance.html":       ("0.7", "weekly"),
    "docs.html":             ("0.7", "weekly"),
    "enterprise.html":       ("0.7", "weekly"),
    "faq.html":              ("0.6", "weekly"),
    "gateway.html":          ("0.7", "weekly"),
    "payments.html":         ("0.7", "weekly"),
    "pricing.html":          ("0.7", "weekly"),
    "protocol.html":         ("0.7", "weekly"),
    "protocol-architecture.html": ("0.7", "weekly"),
    "roadmap.html":          ("0.6", "weekly"),
    "solutions.html":        ("0.7", "weekly"),
    "working-group.html":    ("0.7", "weekly"),
}
# Everything else gets 0.5 / weekly default

# Helper: format YYYY-MM-DD from file mtime
def lastmod(path):
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d")

def classify(name):
    if name in PRIORITY_HIGH:
        return PRIORITY_HIGH[name]
    if name in PRIORITY_MID:
        return PRIORITY_MID[name]
    return ("0.5", "weekly")

def main():
    pages = []
    for p in sorted(WEB.glob("*.html")):
        if p.name in EXCLUDE:
            continue
        pages.append(p)

    print(f"Building sitemap from {len(pages)} public pages")

    # Build XML
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    # Special-case the root URL (index.html → /)
    root_path = WEB / "index.html"
    root_pri, root_freq = PRIORITY_HIGH["index.html"]
    lines.append('  <url>')
    lines.append(f'    <loc>{BASE}/</loc>')
    lines.append(f'    <lastmod>{lastmod(root_path)}</lastmod>')
    lines.append(f'    <changefreq>{root_freq}</changefreq>')
    lines.append(f'    <priority>{root_pri}</priority>')
    lines.append('  </url>')

    # Every other page
    for p in pages:
        if p.name == "index.html":
            continue
        pri, freq = classify(p.name)
        lines.append('  <url>')
        lines.append(f'    <loc>{BASE}/{p.name}</loc>')
        lines.append(f'    <lastmod>{lastmod(p)}</lastmod>')
        lines.append(f'    <changefreq>{freq}</changefreq>')
        lines.append(f'    <priority>{pri}</priority>')
        lines.append('  </url>')

    lines.append('</urlset>')
    out = "\n".join(lines) + "\n"

    sitemap_path = WEB / "sitemap.xml"
    sitemap_path.write_text(out)
    print(f"Wrote {sitemap_path} ({len(out)} chars, {len(pages)} URLs)")

    # Quick sanity diff
    import subprocess
    print("\n=== distinct lastmod dates ===")
    r = subprocess.run(["grep", "-oE", "<lastmod>[^<]*", str(sitemap_path)],
                       capture_output=True, text=True)
    dates = sorted(set(r.stdout.strip().split("\n")))
    for d in dates:
        print(f"  {d}>")

if __name__ == "__main__":
    main()
