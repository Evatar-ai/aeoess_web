#!/usr/bin/env python3
"""Apply (old,new) edits from a JSON manifest to all 21 KYA pages."""
import sys, os, subprocess, json, re

PAGES = ['index','blog','compare','compliance','contact','content','docs',
         'enterprise','faq','opensource','payments','portal','pricing',
         'privacy','protocol','research','roadmap','sitemap','terms',
         'threat-model','working-group']

HERE = os.path.dirname(os.path.abspath(__file__))
HARNESS = os.path.join(HERE, 'bundle_edit.py')
SITE_ROOT = os.path.dirname(HERE)

def run(args, check=True):
    return subprocess.run(['python3', HARNESS] + args, capture_output=True, text=True, check=check)

def main():
    edits = json.load(open(sys.argv[1]))
    print(f'applying {len(edits)} edits across {len(PAGES)} pages\n')
    summary = []
    for page in PAGES:
        path = os.path.join(SITE_ROOT, f'{page}.html')
        if not os.path.exists(path):
            print(f'  {page:18}: MISSING'); continue
        per = []
        for e in edits:
            r = run(['REPLACE_GLOBAL', path, e['old'], e['new']])
            if 'no matches' in r.stdout:
                per.append(0)
            else:
                m = re.search(r'OK: (\d+) replacements', r.stdout)
                per.append(int(m.group(1)) if m else -1)
        ig = run(['CHECK_INTEGRITY', path], check=False)
        ig_ok = 'ok, 0 bad' in ig.stdout
        total = sum(v for v in per if v > 0)
        status = 'OK' if ig_ok else 'FAIL'
        print(f'  {page:18}  hits={per}  [{status}]')
        summary.append((page, total, ig_ok))
    print(f'\ntotal pages with edits: {sum(1 for _,t,_ in summary if t>0)}')
    print(f'integrity-clean: {sum(1 for _,_,ok in summary if ok)} / {len(summary)}')

if __name__ == '__main__': main()
