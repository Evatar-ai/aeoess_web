#!/usr/bin/env python3
"""
Push a list of recently-changed URLs to IndexNow (Bing, Yandex, Seznam, Naver).

IndexNow is a simple HTTP-based protocol: POST a signed list of URLs to one
API endpoint, and all participating search engines pick it up. No login, no
2FA, no per-engine setup.

Usage:
  python3 scripts/indexnow-ping.py            # pings recently-changed pages
  python3 scripts/indexnow-ping.py --all      # pings every URL in sitemap.xml

Requires:
  - {KEY}.txt at site root, accessible at https://aeoess.com/{KEY}.txt
  - sitemap.xml at site root with current <lastmod> values
"""
import re
import sys
import json
import urllib.request
from pathlib import Path
from datetime import datetime, timedelta

WEB = Path(__file__).resolve().parent.parent
HOST = "aeoess.com"
KEY = "a7898ddc0d42f7b97fd8e5b7b6e9c4422744b895dc4396a84472b69acaeb9991"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

# IndexNow API endpoint (Bing's; all participating engines share the index)
ENDPOINT = "https://api.indexnow.org/IndexNow"


def parse_sitemap():
    """Yield (url, lastmod_date) tuples from sitemap.xml."""
    text = (WEB / "sitemap.xml").read_text()
    pattern = re.compile(
        r"<url>\s*<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>",
        re.DOTALL,
    )
    for m in pattern.finditer(text):
        yield m.group(1).strip(), m.group(2).strip()


def select_recent(days=3):
    """URLs changed within the last N days."""
    cutoff = (datetime.now() - timedelta(days=days)).date()
    out = []
    for url, lastmod in parse_sitemap():
        try:
            d = datetime.strptime(lastmod, "%Y-%m-%d").date()
        except ValueError:
            continue
        if d >= cutoff:
            out.append(url)
    return out


def select_all():
    return [url for url, _ in parse_sitemap()]


def ping(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Host": "api.indexnow.org",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace")
    except Exception as e:
        return 0, str(e)


def main():
    if "--all" in sys.argv:
        urls = select_all()
        mode = "ALL"
    else:
        urls = select_recent(days=3)
        mode = "RECENT (last 3 days)"

    print(f"Mode: {mode}")
    print(f"URLs to push: {len(urls)}")
    for u in urls:
        print(f"  {u}")
    if not urls:
        print("Nothing to push. Exiting clean.")
        return 0

    print(f"\nKey location: {KEY_LOCATION}")
    print(f"Endpoint: {ENDPOINT}")
    print(f"Pinging IndexNow...")

    status, body = ping(urls)
    print(f"\nResponse: HTTP {status}")
    if body:
        print(f"Body: {body[:500]}")

    # IndexNow contract:
    # 200 = OK (URLs received and added)
    # 202 = Accepted (URLs received, validation pending)
    # 400 = Bad request (malformed)
    # 403 = Forbidden (key file mismatch or not reachable)
    # 422 = Unprocessable (URLs don't belong to host, or other validation)
    # 429 = Too many requests
    if status in (200, 202):
        print("\nOK. IndexNow accepted the push.")
        return 0
    elif status == 0:
        print("\nNetwork error. Try again in a minute.")
        return 1
    else:
        print(f"\nNon-success response. Investigate above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
