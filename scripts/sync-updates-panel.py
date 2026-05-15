#!/usr/bin/env python3
"""
Sync the Updates panel from opensource.html (canonical) to peer pages.

opensource.html is the canonical source for both:
  - the JS UPDATES = [...] array (top of file, used by React render)
  - the static rendered <aside data-updates-panel> block (between BUILD:UPDATES_START / BUILD:UPDATES_END)

This script:
  0. Regenerates the static block in opensource.html from its var UPDATES
     array (via scripts/build-updates-panel.mjs), so the baked block can
     never drift behind the array.
  1. Reads the canonical UPDATES JS array from opensource.html
  2. Reads the (freshly regenerated) static rendered block (between BUILD:UPDATES markers)
  3. Writes both to every peer .html file in aeoess_web/ that has BUILD:UPDATES markers

Run: python3 scripts/sync-updates-panel.py
"""
import re, sys, subprocess
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
OPENSOURCE = WEB / 'opensource.html'

# Step 0: regenerate the canonical static <aside data-updates-panel> block in
# opensource.html from its var UPDATES array, so the baked block can never
# drift behind the array. Without this, this script faithfully propagates a
# stale block to every peer page (the bug that froze the panel at May 11).
subprocess.run(['node', str(WEB / 'scripts' / 'build-updates-panel.mjs')], check=True)

src = OPENSOURCE.read_text()

# Extract canonical JS UPDATES array
mjs = re.search(r'var UPDATES = (\[\{.*?\}\]);', src, re.DOTALL)
if not mjs:
    print('ERROR: could not find var UPDATES array in opensource.html', file=sys.stderr)
    sys.exit(1)
canonical_js = mjs.group(1)

# Extract canonical static rendered block (the <aside data-updates-panel ...> all the way to its closing </aside>,
# specifically what sits between <!-- BUILD:UPDATES_START --> and <!-- BUILD:UPDATES_END -->).
ms = re.search(r'(<!-- BUILD:UPDATES_START -->)(.*?)(<!-- BUILD:UPDATES_END -->)', src, re.DOTALL)
if not ms:
    print('ERROR: could not find BUILD:UPDATES markers in opensource.html', file=sys.stderr)
    sys.exit(1)
canonical_static = ms.group(2)

print(f'Canonical JS array: {len(canonical_js)} chars')
print(f'Canonical static block: {len(canonical_static)} chars')

# Find peer pages: any html file that has var UPDATES = [...] (JS array) OR BUILD:UPDATES markers
peers = []
for p in sorted(WEB.glob('*.html')):
    if p.name == 'opensource.html':
        continue
    text = p.read_text()
    has_js = bool(re.search(r'var UPDATES = \[\{', text))
    has_markers = '<!-- BUILD:UPDATES_START -->' in text and '<!-- BUILD:UPDATES_END -->' in text
    if has_js or has_markers:
        peers.append((p, has_js, has_markers))

print(f'\nPeer pages: {len(peers)}')

updated = 0
for p, has_js, has_markers in peers:
    text = p.read_text()
    new_text = text
    if has_js:
        new_text = re.sub(
            r'var UPDATES = \[\{.*?\}\];',
            lambda _: f'var UPDATES = {canonical_js};',
            new_text,
            count=1,
            flags=re.DOTALL,
        )
    if has_markers:
        new_text = re.sub(
            r'(<!-- BUILD:UPDATES_START -->).*?(<!-- BUILD:UPDATES_END -->)',
            lambda m: m.group(1) + canonical_static + m.group(2),
            new_text,
            count=1,
            flags=re.DOTALL,
        )
    if new_text != text:
        p.write_text(new_text)
        updated += 1
        flags = ('js' if has_js else '') + ('+markers' if has_markers else '')
        print(f'  updated [{flags}]: {p.name}')
    else:
        print(f'  unchanged: {p.name}')

print(f'\nDone. {updated} of {len(peers)} peer page(s) updated.')
