#!/usr/bin/env python3
"""
Submit all aeoess.com URLs from sitemap.xml to IndexNow.

IndexNow is a free, open protocol supported by Bing, Yandex, Seznam, Naver,
and Yep.com. A single POST notifies all of them at once. Submission
triggers a near-instant re-crawl of the listed URLs.

Run after every meaningful content deploy:
    python3 .kya-tools/indexnow-submit.py

This is a one-shot, idempotent operation — no state, no rate limits below
~10,000 URLs/day per host. Failure modes are visible (HTTP 4xx, 5xx with
explanation). The key file is at /894a2fae4f4943d6bb758b4333209c83.txt on
the public site; if IndexNow cannot fetch it (404), submission fails.
"""
import json
import re
import urllib.request
import urllib.error
import sys
from xml.etree import ElementTree as ET

HOST = 'aeoess.com'
KEY_FILE = '.kya-tools/indexnow-key.txt'
SITEMAP_FILE = 'sitemap.xml'
INDEXNOW_API = 'https://api.indexnow.org/IndexNow'

def read_key():
    with open(KEY_FILE) as f:
        return f.read().strip()

def read_sitemap():
    tree = ET.parse(SITEMAP_FILE)
    ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    return [el.text for el in tree.getroot().findall('sm:url/sm:loc', ns)]

def submit(key, urls):
    body = {
        'host': HOST,
        'key': key,
        'keyLocation': f'https://{HOST}/{key}.txt',
        'urlList': urls,
    }
    payload = json.dumps(body).encode()
    req = urllib.request.Request(
        INDEXNOW_API,
        data=payload,
        headers={'Content-Type': 'application/json; charset=utf-8'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()

def main():
    key = read_key()
    urls = read_sitemap()
    print(f'IndexNow key: {key}')
    print(f'URLs to submit: {len(urls)}')
    for u in urls[:5]:
        print(f'  - {u}')
    if len(urls) > 5:
        print(f'  ... and {len(urls) - 5} more')
    print()
    print(f'POST {INDEXNOW_API}')
    status, body = submit(key, urls)
    print(f'HTTP {status}')
    print(body if body else '(empty body)')
    # IndexNow returns 200 (success) or 202 (accepted, will process).
    # 400 = bad request (often key file mismatch). 403 = key validation fail.
    # 422 = URLs do not match host. 429 = rate-limited.
    sys.exit(0 if status in (200, 202) else 1)

if __name__ == '__main__':
    main()
