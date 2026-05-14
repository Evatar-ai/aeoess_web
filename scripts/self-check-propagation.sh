#!/usr/bin/env bash
#
# self-check-propagation.sh — comprehensive audit of propagation surfaces
#
# Run this weekly (or after any major ship) to catch drift that has escaped
# propagate.mjs. Mirrors the manual self-check audit done 2026-04-23 that
# found 7 categories of missed surface (camel/AGENTS.md revelation).
#
# Usage:
#   ./scripts/self-check-propagation.sh            # human-readable report
#   ./scripts/self-check-propagation.sh --strict   # exit non-zero on any fail
#   ./scripts/self-check-propagation.sh --json     # machine-readable output
#
# Spec: see internal propagation spec (self-check audit).
# Run as part of pre-publish discipline.

set -u

STRICT=0
JSON=0
for arg in "$@"; do
  case $arg in
    --strict) STRICT=1 ;;
    --json)   JSON=1 ;;
  esac
done

# Repos in scope (TAT intentionally excluded — separate project)
WEB="$HOME/aeoess_web"
SDK="$HOME/agent-passport-system"
MCP="$HOME/agent-passport-mcp"
PY="$HOME/agent-passport-python"
VOCAB="$HOME/agent-governance-vocabulary"
ECOMAP="$HOME/agent-ecosystem-map"
ORG="$HOME/aeoess-dot-github"

PROP="$WEB/scripts/propagate.mjs"

FAIL_COUNT=0
PASS_COUNT=0
declare -a FINDINGS=()

record_pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  [ "$JSON" -eq 0 ] && printf "  \033[32m[PASS]\033[0m %s\n" "$1"
}

record_fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  FINDINGS+=("$1")
  [ "$JSON" -eq 0 ] && printf "  \033[31m[FAIL]\033[0m %s\n" "$1"
}

section() {
  [ "$JSON" -eq 0 ] && printf "\n\033[1m=== %s ===\033[0m\n" "$1"
}

#
# CATEGORY A — Agent-context files across ALL repos must be in propagate.mjs
#
# Every AGENTS.md, CLAUDE.md, llms.txt in every in-scope repo must appear
# in propagate.mjs target file list. Camel/Cursor/Codex/Claude all read
# these, so drift = stale context for agents.
#
section "A. Agent-context files"

for repo in "$SDK" "$MCP" "$PY" "$VOCAB" "$WEB"; do
  for name in AGENTS.md CLAUDE.md llms.txt; do
    f="$repo/$name"
    [ -f "$f" ] || continue
    short=$(echo "$f" | sed "s|$HOME/||")
    # propagate.mjs uses template literals like ${REPOS.sdk}/AGENTS.md
    # so search for the last two components: repo-label and filename.
    repo_label=$(basename "$repo" | sed 's/agent-passport-//;s/agent-//;s/aeoess_web/web/;s/aeoess-dot-github/org/')
    # Use a cross-variant match: either literal short path OR REPOS.xxx/filename
    if grep -Fq "$short" "$PROP" 2>/dev/null \
       || grep -qE "REPOS\.(sdk|mcp|python|vocab|web|ecomap|org)[^/]*/${name}" "$PROP" 2>/dev/null; then
      record_pass "$short in propagate.mjs"
    else
      record_fail "$short NOT in propagate.mjs — add to getTargetFiles()"
    fi
  done
done

# Ecosystem map only has README.md
if [ -f "$ECOMAP/README.md" ]; then
  if grep -qE "REPOS\.ecomap[^/]*/README\.md" "$PROP" 2>/dev/null \
     || grep -Fq "agent-ecosystem-map/README.md" "$PROP" 2>/dev/null; then
    record_pass "agent-ecosystem-map/README.md in propagate.mjs"
  else
    record_fail "agent-ecosystem-map/README.md NOT in propagate.mjs"
  fi
fi

# TAT must NOT be in propagate (it's a separate project that licenses APS)
if grep -q "theagenttimes" "$PROP" 2>/dev/null; then
  record_fail "theagenttimes in propagate.mjs — should be removed (separate project)"
else
  record_pass "theagenttimes correctly excluded from propagate.mjs"
fi

#
# CATEGORY B — .well-known/ files
#
# Machine-readable discovery endpoints. mcp.json is the most drift-prone
# because it embeds both SDK and MCP versions plus tools_count + modules + tests.
#
section "B. .well-known/ files"

for wk in mcp.json aeoess-issuer.json agent-trust.json aps.txt agents.json; do
  f="$WEB/.well-known/$wk"
  [ -f "$f" ] || { record_fail ".well-known/$wk missing"; continue; }
  # agents.json and aps.txt have schema versions, not product versions — not propagation targets
  if [ "$wk" = "agents.json" ] || [ "$wk" = "aps.txt" ] || [ "$wk" = "agent-trust.json" ]; then
    record_pass ".well-known/$wk (schema/cert only, not propagation target)"
    continue
  fi
  if grep -Fq ".well-known/$wk" "$PROP" 2>/dev/null; then
    record_pass ".well-known/$wk in propagate.mjs"
  else
    # Flag only if file contains product-version-bound content
    if grep -qE "sdk.*version|tools_count|\"modules\"[[:space:]]*:[[:space:]]*[0-9]|\"tests\"[[:space:]]*:[[:space:]]*[0-9]" "$f" 2>/dev/null; then
      record_fail ".well-known/$wk has product-versioned content but NOT in propagate.mjs"
    else
      record_pass ".well-known/$wk (no product-versioned content, OK not in propagate)"
    fi
  fi
done

# mcp.json-specific checks
if [ -f "$WEB/.well-known/mcp.json" ]; then
  sdk_expected=$(jq -r .version "$SDK/package.json" 2>/dev/null || echo "?")
  mcp_expected=$(jq -r .version "$MCP/package.json" 2>/dev/null || echo "?")
  sdk_in_mcpjson=$(jq -r '.sdk.version // ""' "$WEB/.well-known/mcp.json" 2>/dev/null)
  mcp_in_mcpjson=$(jq -r '.version // ""' "$WEB/.well-known/mcp.json" 2>/dev/null)
  if [ "$sdk_in_mcpjson" = "$sdk_expected" ]; then
    record_pass ".well-known/mcp.json sdk.version matches ($sdk_in_mcpjson)"
  else
    record_fail ".well-known/mcp.json sdk.version=$sdk_in_mcpjson (expected $sdk_expected)"
  fi
  if [ "$mcp_in_mcpjson" = "$mcp_expected" ]; then
    record_pass ".well-known/mcp.json version matches ($mcp_in_mcpjson)"
  else
    record_fail ".well-known/mcp.json version=$mcp_in_mcpjson (expected $mcp_expected)"
  fi
fi

#
# CATEGORY C — Sitemap coverage
#
# Every .html file must be in sitemap.xml (exceptions: private or drafts).
#
section "C. Sitemap coverage"

actual_count=$(ls "$WEB"/*.html 2>/dev/null | wc -l | tr -d ' ')
sitemap_count=$(grep -c "<url>" "$WEB/sitemap.xml" 2>/dev/null || echo 0)

if [ -f "$WEB/sitemap.xml" ]; then
  record_pass "sitemap.xml exists ($sitemap_count URLs, $actual_count html files)"
  for f in "$WEB"/*.html; do
    bn=$(basename "$f")
    # Skip pages that explicitly declare noindex — search engines should
    # never crawl them from a sitemap, so demanding their presence is wrong.
    # (welcome.html, dashboard.html, embed-host-preview.html, etc.)
    if grep -q 'name="robots" content="noindex' "$f" 2>/dev/null; then
      continue
    fi
    # Special case for index.html → aeoess.com/
    if [ "$bn" = "index.html" ]; then
      grep -q "aeoess.com/</loc>\|aeoess.com/\"" "$WEB/sitemap.xml" \
        && record_pass "sitemap includes /" \
        || record_fail "sitemap missing aeoess.com/"
    else
      grep -q "aeoess.com/$bn" "$WEB/sitemap.xml" \
        && record_pass "sitemap includes $bn" \
        || record_fail "sitemap missing $bn"
    fi
  done
else
  record_fail "sitemap.xml not found"
fi

#
# CATEGORY D — Paper count in llms.txt files
#
# Canonical = 7 papers + IETF draft. Every llms.txt that lists papers
# must list all 7. aeoess.com/llms.txt is the highest-visibility one.
#
section "D. Paper count in llms.txt"

EXPECTED_PAPERS=7

for f in "$WEB/llms.txt" "$WEB/llms-full.txt" \
         "$SDK/llms.txt" "$MCP/llms.txt" "$PY/llms.txt" \
         "$VOCAB/llms.txt"; do
  [ -f "$f" ] || continue
  short=$(echo "$f" | sed "s|$HOME/||")
  count=$(grep -c "zenodo\.1[89]" "$f" 2>/dev/null)
  count=${count:-0}
  if [ "$count" -ge "$EXPECTED_PAPERS" ]; then
    record_pass "$short lists $count papers (>= $EXPECTED_PAPERS)"
  else
    record_fail "$short lists $count papers (expected $EXPECTED_PAPERS)"
  fi
done

# Org profile
if [ -f "$ORG/profile/README.md" ]; then
  count=$(grep -c "zenodo\.1" "$ORG/profile/README.md" 2>/dev/null)
  count=${count:-0}
  [ "$count" -ge "$EXPECTED_PAPERS" ] \
    && record_pass "aeoess-dot-github README lists $count papers" \
    || record_fail "aeoess-dot-github README lists $count papers (expected $EXPECTED_PAPERS)"
fi

#
# CATEGORY E — v2 module count drift
#
# Canonical = 84 core + 41 v2 = 125 modules as of Apr 23. Common drift:
# '40 v2', '39 v2', '32 v2' (very stale), '71 core' (very stale).
# Scan for patterns likely to be stale v2 references.
#
section "E. v2 module count drift"

CURRENT_CORE=84
CURRENT_V2=41

declare -a STALE_PATTERNS=(
  "40 v2"
  "39 v2"
  "71 core"
  "84 core + 3[0-9] v2"
  "84\\+40"
  "84\\+39"
)

for pattern in "${STALE_PATTERNS[@]}"; do
  # Scan HTML pages and llms files, exclude dated blog articles
  hits=$(grep -rlE "$pattern" \
    "$WEB"/*.html "$WEB"/llms.txt "$WEB"/llms-full.txt \
    "$SDK"/README.md "$MCP"/README.md "$PY"/README.md 2>/dev/null \
    | grep -v "blog.html")
  if [ -z "$hits" ]; then
    record_pass "no '$pattern' in current-state surfaces"
  else
    # blog.html is allowed via exclusion, but we may still be inside a dated article
    for h in $hits; do
      # Only flag if pattern is outside <article class="post"> blocks
      count=$(awk '
        /<article class="post"/ { in_article=1 }
        /<\/article>/ { in_article=0; next }
        !in_article { print }
      ' "$h" 2>/dev/null | grep -cE "$pattern")
      [ "$count" -gt 0 ] && record_fail "$(basename "$h") contains stale '$pattern' ($count hits outside dated articles)"
    done
  fi
done

#
# CATEGORY F — SDK CLAUDE.md drift check (heavy-drift file identified in audit)
#
section "F. SDK CLAUDE.md drift"

if [ -f "$SDK/CLAUDE.md" ]; then
  SDK_VERSION=$(jq -r .version "$SDK/package.json" 2>/dev/null || echo "?")
  # The actual current-ness test: does it mention the current SDK version?
  if grep -q "$SDK_VERSION" "$SDK/CLAUDE.md"; then
    record_pass "SDK/CLAUDE.md references current SDK version ($SDK_VERSION)"
  else
    record_fail "SDK/CLAUDE.md does not reference current SDK version ($SDK_VERSION) — file is stale"
  fi
  # Known stale patterns from the Apr 23 audit
  for stale_pat in "v1\.41\.0" "2,?764 tests" "132 tools" "71 core" "714 suites"; do
    if grep -qE "$stale_pat" "$SDK/CLAUDE.md"; then
      record_fail "SDK/CLAUDE.md contains stale pattern '$stale_pat'"
    fi
  done
else
  record_fail "SDK/CLAUDE.md missing"
fi

#
# CATEGORY G — package.json and pyproject.toml descriptions
#
# npm and PyPI display these; stale counts go public.
#
section "G. package.json / pyproject.toml descriptions"

SDK_TEST_COUNT=$(cd "$SDK" && npm test --silent 2>/dev/null | grep -oE "Tests: +[0-9]+ passed" | head -1 | grep -oE "[0-9]+" || echo "?")

if [ -f "$SDK/package.json" ] && [ "$SDK_TEST_COUNT" != "?" ]; then
  desc=$(jq -r .description "$SDK/package.json")
  # Look for any NNNN tests pattern in description
  desc_count=$(echo "$desc" | grep -oE "[0-9],?[0-9]{3} tests" | head -1 | tr -d ',' | grep -oE "[0-9]+")
  if [ -n "$desc_count" ] && [ "$desc_count" = "$SDK_TEST_COUNT" ]; then
    record_pass "SDK package.json description test count matches ($desc_count)"
  elif [ -n "$desc_count" ]; then
    record_fail "SDK package.json description says $desc_count tests (actual $SDK_TEST_COUNT)"
  fi
fi

if [ -f "$MCP/package.json" ]; then
  mcp_tool_count=$(grep -c 'server.tool(' "$MCP/src/index.ts" 2>/dev/null)
  desc=$(jq -r .description "$MCP/package.json")
  desc_tools=$(echo "$desc" | grep -oE "[0-9]+ tools" | head -1 | grep -oE "[0-9]+")
  if [ -n "$desc_tools" ] && [ "$desc_tools" = "$mcp_tool_count" ]; then
    record_pass "MCP package.json description tool count matches ($desc_tools)"
  elif [ -n "$desc_tools" ]; then
    record_fail "MCP package.json description says $desc_tools tools (actual $mcp_tool_count)"
  fi
fi

#
# CATEGORY H — Ecosystem map freshness
#
section "H. Ecosystem map freshness"

if [ -f "$ECOMAP/docs/ecosystem-data.json" ]; then
  # Check how many hours old the JSON is
  if [ "$(uname)" = "Darwin" ]; then
    age_seconds=$(($(date +%s) - $(stat -f %m "$ECOMAP/docs/ecosystem-data.json")))
  else
    age_seconds=$(($(date +%s) - $(stat -c %Y "$ECOMAP/docs/ecosystem-data.json")))
  fi
  age_hours=$((age_seconds / 3600))
  if [ "$age_hours" -lt 36 ]; then
    record_pass "ecosystem-data.json is ${age_hours}h old (< 36h, fresh)"
  else
    record_fail "ecosystem-data.json is ${age_hours}h old — rebuild via 'python3 scripts/build-ecosystem-data.py'"
  fi

  # Quick sanity on stats
  if command -v jq >/dev/null 2>&1; then
    projects=$(jq -r .stats.projects "$ECOMAP/docs/ecosystem-data.json")
    people=$(jq -r .stats.people "$ECOMAP/docs/ecosystem-data.json")
    threads=$(jq -r .stats.threads "$ECOMAP/docs/ecosystem-data.json")
    record_pass "ecosystem-data.json: $projects projects, $people people, $threads threads"
  fi
else
  record_fail "ecosystem-data.json not found — run build-ecosystem-data.py"
fi

#
# CATEGORY I — propagate.mjs --verify-only drift count
#
section "I. propagate.mjs --verify-only"

if [ -f "$PROP" ]; then
  # Run in subshell, capture drift count
  drift_count=$(cd "$WEB" && node scripts/propagate.mjs --verify-only 2>&1 \
    | grep -oE "found [0-9]+ drift" | grep -oE "[0-9]+" | head -1 || echo 0)
  if [ "$drift_count" -eq 0 ]; then
    record_pass "propagate.mjs reports 0 drift"
  elif [ "$drift_count" -lt 20 ]; then
    record_pass "propagate.mjs reports $drift_count drift (<20 is expected from per-module false positives)"
  elif [ "$drift_count" -lt 50 ]; then
    record_fail "propagate.mjs reports $drift_count drift — spot-check the list"
  else
    record_fail "propagate.mjs reports $drift_count drift — auto-fix needed"
  fi
else
  record_fail "propagate.mjs not found"
fi

#
# CATEGORY J — Daily-rhythm surfaces (today)
#
# Post-May-4-redesign: the updates panel migrated from the legacy
# <div class="up-i"> ribbon on index.html to a React-rendered <aside
# data-updates-panel> whose canonical source is the `var UPDATES`
# array in opensource.html. This category checks the post-redesign
# surfaces.
#
section "J. Daily-rhythm surfaces (today)"

# Today's needle in the same format the UPDATES array uses
# (e.g. "May 14", "May 4" — no leading zero on day-of-month).
today_needle="$(date +"%b") $(date +"%-d")"

# 1) Updates panel — canonical freshness.
#    Top entry of var UPDATES in opensource.html must equal today.
#    Use sed (portable) — macOS BSD awk lacks match()-with-array.
top_update_date=$(awk '/var UPDATES = \[/{found=1; next} found' "$WEB/opensource.html" \
  | grep -oE "date:[[:space:]]*'[^']+'" | head -1 \
  | sed -E "s/^date:[[:space:]]*'//; s/'$//")

if [ -z "$top_update_date" ]; then
  record_fail "Updates panel: could not extract top date: from opensource.html (var UPDATES array missing or malformed)"
elif [ "$top_update_date" = "$today_needle" ]; then
  record_pass "Updates panel top entry is today ($today_needle)"
else
  record_fail "Updates panel top entry is $top_update_date, expected today ($today_needle) — EOD updates-panel item missing or opensource.html not updated"
fi

# 2) Updates panel — peer sync integrity.
#    Every root *.html file that carries `var UPDATES = [` must have
#    a byte-identical copy of the canonical array from opensource.html.
#    md5 the line range from `var UPDATES = [` through the first
#    subsequent `}];` line (the array's matching close).
extract_updates_md5() {
  awk '
    /var UPDATES = \[/{found=1}
    found{print}
    found && /^[[:space:]]*\}\];[[:space:]]*$/{exit}
  ' "$1" | md5
}

canonical_md5=$(extract_updates_md5 "$WEB/opensource.html")
peer_total=0
peer_match=0
peer_diverge=()
for f in "$WEB"/*.html; do
  [ -f "$f" ] || continue
  [ "$f" = "$WEB/opensource.html" ] && continue
  grep -q "var UPDATES = \[" "$f" 2>/dev/null || continue
  peer_total=$((peer_total + 1))
  peer_md5=$(extract_updates_md5 "$f")
  if [ "$peer_md5" = "$canonical_md5" ]; then
    peer_match=$((peer_match + 1))
  else
    peer_diverge+=("$(basename "$f")")
  fi
done

if [ "${#peer_diverge[@]}" -eq 0 ]; then
  record_pass "Updates panel: all $peer_match peer pages match opensource.html canonical"
else
  for f in "${peer_diverge[@]}"; do
    record_fail "Updates panel: $f diverges from opensource.html canonical — run sync-updates-panel.py"
  done
fi

# 3) Roadmap — newest-first ordering holds.
#    Don't try to know today's day-N. Just assert the top id >= the
#    second id. Catches mis-inserted entries and stale top-of-file.
#    Note: ids like `d86-pr-67-...` carry multiple numbers; we want only
#    the leading dNNN. Use sed to capture just that token.
top_dN=$(grep -E "^- id: d[0-9]+" "$WEB/roadmap.yaml" | head -1 | sed -E 's/^- id: d([0-9]+).*/\1/')
second_dN=$(grep -E "^- id: d[0-9]+" "$WEB/roadmap.yaml" | sed -n '2p' | sed -E 's/^- id: d([0-9]+).*/\1/')

if [ -z "$top_dN" ] || [ -z "$second_dN" ]; then
  record_fail "roadmap.yaml: could not extract top two d-ids (file empty or malformed)"
elif [ "$top_dN" -ge "$second_dN" ]; then
  record_pass "roadmap.yaml newest id: d${top_dN} (ordering ok)"
else
  record_fail "roadmap.yaml ordering broken: top is d${top_dN} but next is d${second_dN}"
fi

# 4) Blog — latest article date (warn-only, never fail).
#    Not every day ships a blog; a no-blog day is legitimate.
latest_blog_date=$(grep -oE 'datetime="[0-9]{4}-[0-9]{2}-[0-9]{2}"' "$WEB/blog.html" | head -1 | grep -oE "[0-9]{4}-[0-9]{2}-[0-9]{2}")
record_pass "blog latest article: ${latest_blog_date:-unknown}"

#
# CATEGORY K — EOD surface integrity (no writes to dead directories)
#
# Two directories in the repo root are off-limits to propagation /
# EOD scripts: explorations/ (tracked, agent-passport.org design
# lineage — do not touch) and .pre-swap-snapshot/ (gitignored local
# scratch). A correctly-behaving daily run must never modify either.
#
section "K. EOD surface integrity (dead-dir guard)"

# 1) explorations/ — must have no uncommitted changes.
explorations_porcelain=$(git -C "$WEB" status --porcelain explorations/ 2>/dev/null)
if [ -z "$explorations_porcelain" ]; then
  record_pass "explorations/ has no uncommitted changes (untouched)"
else
  record_fail "explorations/ has uncommitted changes — a script wrote to the old-design directory, investigate"
  echo "$explorations_porcelain" | sed 's/^/    /'
fi

# 2) .pre-swap-snapshot/ — must have no files modified in last 24h.
if [ ! -d "$WEB/.pre-swap-snapshot" ]; then
  record_pass ".pre-swap-snapshot/ not present (nothing to check)"
else
  recent=$(find "$WEB/.pre-swap-snapshot" -type f -mtime -1 2>/dev/null)
  if [ -z "$recent" ]; then
    record_pass ".pre-swap-snapshot/ untouched in last 24h"
  else
    record_fail ".pre-swap-snapshot/ has files modified in last 24h — a script is writing to dead scratch dir"
    echo "$recent" | sed 's/^/    /'
  fi
fi

#
# FINAL REPORT
#
section "Summary"

total=$((PASS_COUNT + FAIL_COUNT))

if [ "$JSON" -eq 1 ]; then
  # Machine-readable JSON output
  printf '{\n'
  printf '  "pass_count": %d,\n' "$PASS_COUNT"
  printf '  "fail_count": %d,\n' "$FAIL_COUNT"
  printf '  "total": %d,\n' "$total"
  printf '  "findings": [\n'
  for i in "${!FINDINGS[@]}"; do
    sep=","
    [ "$i" -eq "$((${#FINDINGS[@]} - 1))" ] && sep=""
    printf '    %s%s\n' "\"${FINDINGS[$i]}\"" "$sep"
  done
  printf '  ]\n}\n'
else
  printf "\n  Total checks: %d\n" "$total"
  printf "  \033[32mPassed: %d\033[0m\n" "$PASS_COUNT"
  printf "  \033[31mFailed: %d\033[0m\n" "$FAIL_COUNT"
  if [ "$FAIL_COUNT" -gt 0 ]; then
    printf "\n  Failures to address:\n"
    for f in "${FINDINGS[@]}"; do
      printf "    - %s\n" "$f"
    done
    printf "\n  See internal propagation spec (Self-Check Audit) for remediation.\n"
  else
    printf "\n  All surfaces pass. Propagation state is clean.\n"
  fi
fi

# Exit code
if [ "$STRICT" -eq 1 ] && [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
exit 0
