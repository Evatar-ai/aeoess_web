# Search Console + IndexNow setup (post-deploy, 2026-05-26)

The site is fully prepared for Google Search Console, Bing Webmaster Tools,
and IndexNow. Verification requires a one-time browser flow per platform
because Google/Bing must issue a per-property verification code only the
property owner can claim.

---

## 1. Google Search Console (5 minutes)

### Option A — DNS verification (recommended for Cloudflare-fronted sites)

Lowest friction, survives HTML changes, covers all subdomains in one record.

1. Open https://search.google.com/search-console
2. Click "Add property"
3. Choose "Domain" property (not "URL prefix")
4. Enter `aeoess.com`
5. Google shows a TXT record like:
   ```
   google-site-verification=ABcd1234EfGhIjKlMnOpQrStUvWxYz...
   ```
6. In your Cloudflare dashboard → DNS for `aeoess.com`:
   - Type: TXT
   - Name: `@` (root)
   - Content: paste the full `google-site-verification=...` string
   - TTL: Auto
   - Save
7. Wait ~60 seconds for DNS propagation
8. Click "Verify" in GSC

Domain-level verification covers `aeoess.com` AND any subdomain
(mcp.aeoess.com, gateway.aeoess.com, api.aeoess.com) — one record, all
properties. Don't have to repeat this when you add more subdomains.

### Option B — HTML meta tag (if you don't want a DNS record)

1. In GSC, choose "URL prefix" property type instead
2. Enter `https://aeoess.com`
3. Choose "HTML tag" verification method
4. Google gives you a tag like:
   ```html
   <meta name="google-site-verification" content="ABcd1234..." />
   ```
5. Send me the `content="..."` value; one command injects it into all 19
   KYA pages via the bundle harness, push to deploy
6. Click "Verify" in GSC

### After verification — submit the sitemap

1. In GSC → Sitemaps section
2. Submit `https://aeoess.com/sitemap.xml`
3. Status should turn "Success" within minutes
4. URL inspection tool will then accept individual page requests

The sitemap is already live at https://aeoess.com/sitemap.xml (18 URLs,
last verified 200 OK · 2,433 bytes).

---

## 2. Bing Webmaster Tools (3 minutes)

### Option A — Import from Google Search Console (easiest)

If you've completed step 1:
1. Open https://www.bing.com/webmasters/
2. Sign in
3. Choose "Import sites from Google Search Console"
4. Authorize the OAuth flow
5. Bing auto-imports the verified property + sitemap

### Option B — Manual verification

1. Open https://www.bing.com/webmasters/
2. Add a site: enter `https://aeoess.com`
3. Choose XML file, Meta tag, or DNS record
4. For Meta tag: send me the `content="..."` value, I'll inject
5. For DNS: add the TXT record in Cloudflare same as GSC
6. Click "Verify"

After verification, Bing auto-discovers the sitemap from robots.txt.

---

## 3. IndexNow URL submission (instant — runs on each deploy)

IndexNow is the proactive replacement for the old "ping" mechanism. A
single POST notifies Bing, Yandex, Seznam, Naver, and Yep.com that URLs
need re-crawling. Free, no auth beyond the key file.

The key file is already deployed at:
  https://aeoess.com/894a2fae4f4943d6bb758b4333209c83.txt

Submission script:
  ```bash
  cd ~/aeoess_web && python3 .kya-tools/indexnow-submit.py
  ```

Run it now (after each meaningful content deploy). It reads sitemap.xml
and submits all 18 URLs in one POST. Expected response: HTTP 200 or 202.

Errors and what they mean:
- 400 = key file not reachable at the expected URL. Check that the
  /<key>.txt file is on disk and deployed.
- 403 = key validation failed. The key inside the file must match the
  filename.
- 422 = URLs don't match the host. All URLs must be on aeoess.com.
- 429 = rate-limited. Try again in a few minutes.

---

## 4. Optional but quick wins

### Yandex Webmaster
- https://webmaster.yandex.com/
- Same DNS TXT verification pattern as Google
- Yandex respects the IndexNow submission already, but Webmaster gives
  you indexing reports and search-query data for the .ru audience

### Baidu Webmaster
- https://ziyuan.baidu.com/
- Mostly useful if China is a target market
- Requires Chinese phone number for verification; skip unless needed

### DuckDuckGo
- No submission needed — DDG reads sitemap.xml on its own crawl cycle
- Already covered

### Apple Spotlight Suggestions
- No submission required — Applebot crawls based on links and sitemap
- robots.txt now explicitly allows Applebot + Applebot-Extended

---

## What's already deployed (no action needed)

- /sitemap.xml (18 URLs, all .html files except portal.html)
- /robots.txt (explicit allow for 15+ specific crawlers including all
  major AI/LLM ones, sitemap reference)
- /llms.txt (community-standard LLM index)
- /llms-full.txt (full plain-text site mirror, 19KB)
- /AGENTS.md (AGENTS.md standard navigation file)
- /.well-known/aps.txt (APS governance declaration with did:aps publisher)
- /.well-known/mcp.json (MCP server discovery, 150 tools at mcp.aeoess.com)
- /.well-known/agents.json (4 founder agents with Ed25519 public keys)
- /.well-known/aeoess-issuer.json (passport-issuer countersignature key)
- /.well-known/agent-trust.json
- /.well-known/security.txt (RFC 9116, contact: signal@aeoess.com)
- /894a2fae4f4943d6bb758b4333209c83.txt (IndexNow key file)
- /404.html (custom KYA-styled, agent-friendly)
- /favicon.ico
- apple-touch-icon + theme-color on every page
- Open Graph + Twitter Cards + JSON-LD + canonical on every page
- Per-page agent head block (5 link rel="alternate" tags + agent comment)

---

## When you've finished GSC verification

Send me the verification status and I'll:
1. Confirm sitemap submission status from the GSC API (or guide you to do
   it in the UI)
2. Run a Lighthouse SEO audit on a representative page
3. Add `og:image` files at the right resolutions if any pages are
   missing them
4. Submit individual high-priority URLs for indexing via the GSC URL
   inspection tool

