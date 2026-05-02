#!/usr/bin/env node
/**
 * propagate.mjs — Site-wide canonical-value propagation, JSON-driven.
 *
 * Single source of truth: ~/aeoess_web/project-state.json.
 * Edit that JSON, run this script, every target file gets rewritten.
 *
 * Usage:
 *   node scripts/propagate.mjs                    # dry run (show what would change)
 *   node scripts/propagate.mjs --apply            # actually replace
 *   node scripts/propagate.mjs --apply --commit   # replace + commit + push every repo
 *   node scripts/propagate.mjs --read-only        # just show current canonical values
 *   node scripts/propagate.mjs --verify-only      # cache-independent drift report
 *   node scripts/propagate.mjs --apply --auto-fix-verify
 *                                                 # opt-in: also auto-fix LAYER_COUNT drift
 *                                                 # caught by the verify pass (Bug 1 patch).
 *                                                 # TEST_COUNT and MCP_TOOL_COUNT remain
 *                                                 # report-only because their regex patterns
 *                                                 # match per-section counts as false positives
 *                                                 # (see UPDATE-PROPAGATION-SPEC.md).
 *   node scripts/propagate.mjs --apply --force-roadmap-build
 *                                                 # rebuild roadmap.html even if roadmap.yaml
 *                                                 # hash matches the cache. Useful after
 *                                                 # build-roadmap.mjs itself changes.
 *   node scripts/propagate.mjs --apply --skip-roadmap-build
 *                                                 # skip the roadmap.yaml hash check entirely.
 *                                                 # Use during partial recovery / debugging.
 *
 * Bug fixes vs prior cache-driven design:
 *   Bug 1 (cache no-op on match): the cache-diff pass short-circuits when
 *     `previous === current`, leaving on-disk drift invisible. With JSON
 *     as the source of truth the cache is downgraded to a hint; the verify
 *     pass runs on every invocation and is opt-in auto-fixable.
 *   Bug 2 (parsed total tests, not passing): the script no longer parses
 *     `npm test` output. The passing count is hand-entered in
 *     project-state.json under counts.tests. The schema's `$comment`
 *     reminds the editor to use the passing count, not the registered total.
 *
 * Runs from: /Users/tima/aeoess_web
 * Requires: Node 18+. Pure stdlib — no third-party deps.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'path';

// ── Repo paths (portable — works on Air or Mini) ──
const HOME = process.env.HOME || '/Users/tima';
const REPOS = {
  sdk: resolve(`${HOME}/agent-passport-system`),
  mcp: resolve(`${HOME}/agent-passport-mcp`),
  web: resolve(`${HOME}/aeoess_web`),
  org: resolve(`${HOME}/aeoess-dot-github`), // GitHub org profile README
  python: resolve(`${HOME}/agent-passport-python`),                     // v3 audit: Python SDK
  vocab: resolve(`${HOME}/agent-governance-vocabulary`),                // v3 audit: vocabulary repo
  ecomap: resolve(`${HOME}/agent-ecosystem-map`),                       // v3 audit: ecosystem map
};

// ── Source-of-truth: project-state.json ──
// Single hand-edited file. The propagator reads canonical values from
// here and rewrites every target file to match. No npm test exec, no
// filesystem-derived counts. Bumping a value in the JSON is the entire
// release-time edit.
const STATE_PATH = `${REPOS.web}/project-state.json`;

function loadProjectState() {
  if (!existsSync(STATE_PATH)) {
    throw new Error(`project-state.json not found at ${STATE_PATH}`);
  }
  const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  // Validate the minimum-required shape rather than failing deep inside
  // a pattern lookup if a key is missing.
  if (!state.versions || !state.counts) {
    throw new Error('project-state.json: missing required `versions` or `counts` block');
  }
  return state;
}

// ── Roadmap auto-rebuild ──
// In --apply mode, detect roadmap.yaml drift and rebuild roadmap.html
// before the per-file rewrite loop runs. The rebuilt roadmap.html then
// flows through the regular drift-check pipeline. Cache lives in its
// own file (.roadmap-build-cache.json) — distinct from the propagate
// cache schema. Build failure aborts the propagate run so we never
// push partial state. Dry-run is side-effect-free: this function is
// only called from the apply-mode branch.
const ROADMAP_YAML_PATH = `${REPOS.web}/roadmap.yaml`;
const ROADMAP_BUILD_SCRIPT = `${REPOS.web}/scripts/build-roadmap.mjs`;
const ROADMAP_CACHE_PATH = `${REPOS.web}/scripts/.roadmap-build-cache.json`;

function runRoadmapBuild({ force = false } = {}) {
  if (!existsSync(ROADMAP_YAML_PATH)) {
    console.log('Roadmap: roadmap.yaml not found — skipping rebuild.');
    return;
  }
  if (!existsSync(ROADMAP_BUILD_SCRIPT)) {
    console.log('Roadmap: build-roadmap.mjs not found — skipping rebuild.');
    return;
  }

  const yamlBytes = readFileSync(ROADMAP_YAML_PATH);
  const currentHash = createHash('sha256').update(yamlBytes).digest('hex');

  let previousHash = null;
  let cacheMissing = !existsSync(ROADMAP_CACHE_PATH);
  if (!cacheMissing) {
    try {
      const cached = JSON.parse(readFileSync(ROADMAP_CACHE_PATH, 'utf8'));
      previousHash = cached?.roadmap_yaml_sha256 ?? null;
    } catch {
      // Corrupt cache — treat as missing, force rebuild.
      cacheMissing = true;
    }
  }

  const reason = force
    ? 'force'
    : cacheMissing
      ? 'cache-missing'
      : previousHash !== currentHash
        ? 'hash-changed'
        : null;

  if (!reason) {
    console.log(`Roadmap: cache hash matches (${currentHash.slice(0, 12)}…). Skipping rebuild.`);
    return;
  }

  console.log(`Roadmap: rebuilding (${reason})...`);
  try {
    const out = execSync(`node ${JSON.stringify(ROADMAP_BUILD_SCRIPT)}`, {
      cwd: REPOS.web,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (out) process.stdout.write(out);
  } catch (e) {
    console.error('❌ Roadmap rebuild failed. Aborting propagate run (no partial state pushed).');
    if (e.stdout) process.stdout.write(e.stdout);
    if (e.stderr) process.stderr.write(e.stderr);
    process.exit(1);
  }

  // Cache is updated only on successful build.
  const cachePayload = {
    roadmap_yaml_sha256: currentHash,
    last_built_at: new Date().toISOString(),
  };
  writeFileSync(ROADMAP_CACHE_PATH, JSON.stringify(cachePayload, null, 2) + '\n', 'utf8');
  console.log(`Roadmap: cache updated (${currentHash.slice(0, 12)}…).`);
}

// Derive the flat variable namespace the rest of the script consumes.
// Same shape as the pre-refactor readSourceOfTruth() returned, so all
// downstream pattern-generation and replacement logic is unchanged.
function readSourceOfTruth() {
  const state = loadProjectState();
  const values = {
    SDK_VERSION:       state.versions.sdk,
    MCP_VERSION:       state.versions.mcp,
    PYTHON_VERSION:    state.versions.python,
    TEST_COUNT:        state.counts.tests,        // PASSING count, not registered total
    MCP_TOOL_COUNT:    state.counts.mcp_tools,
    CORE_MODULE_COUNT: state.counts.modules_core,
    V2_MODULE_COUNT:   state.counts.modules_v2,
    LAYER_COUNT:       state.counts.modules_total,
    PAPER_COUNT:       state.counts.papers,
    CORE_SURFACE:      state.counts.core_surface_functions,
    EXTENDED_SURFACE:  state.counts.extended_surface_exports,
    UPDATED:           state.updated,
  };
  // Sanity-check the modules sum (catches typos in the hand-edited JSON
  // before they propagate to 16+ files).
  if (values.CORE_MODULE_COUNT + values.V2_MODULE_COUNT !== values.LAYER_COUNT) {
    console.warn(
      `⚠ project-state.json: modules_total (${values.LAYER_COUNT}) != ` +
      `modules_core (${values.CORE_MODULE_COUNT}) + modules_v2 (${values.V2_MODULE_COUNT})`
    );
  }
  return values;
}

// ── Files to scan ──
// Every file that references propagation variables, with repo context.
function getTargetFiles() {
  return [
    // SDK repo
    { path: `${REPOS.sdk}/README.md`, repo: 'sdk' },
    { path: `${REPOS.sdk}/package.json`, repo: 'sdk' },
    { path: `${REPOS.sdk}/llms.txt`, repo: 'sdk' },                     // v3 spec: was missing
    // MCP repo
    { path: `${REPOS.mcp}/README.md`, repo: 'mcp' },
    { path: `${REPOS.mcp}/package.json`, repo: 'mcp' },
    { path: `${REPOS.mcp}/llms.txt`, repo: 'mcp' },                     // v3 spec: was missing
    { path: `${REPOS.mcp}/glama.json`, repo: 'mcp' },                   // v3 spec: tools_count
    { path: `${REPOS.mcp}/AGENTS.md`, repo: 'mcp' },                    // v3 audit: counts in prose
    { path: `${REPOS.mcp}/CLAUDE.md`, repo: 'mcp' },                    // v3 audit: pointer-only but kept in sync
    { path: `${REPOS.sdk}/AGENTS.md`, repo: 'sdk' },                    // v3 audit: counts in prose
    { path: `${REPOS.sdk}/CLAUDE.md`, repo: 'sdk' },                    // v3 audit: HEAVILY DRIFTED — catch here
    // Web repo — public pages
    { path: `${REPOS.web}/index.html`, repo: 'web' },
    { path: `${REPOS.web}/llms.txt`, repo: 'web' },
    { path: `${REPOS.web}/llms-full.txt`, repo: 'web' },
    { path: `${REPOS.web}/compare.html`, repo: 'web' },
    { path: `${REPOS.web}/media.html`, repo: 'web' },
    { path: `${REPOS.web}/passport.html`, repo: 'web' },
    { path: `${REPOS.web}/blog.html`, repo: 'web' },
    { path: `${REPOS.web}/threat-model.html`, repo: 'web' },
    { path: `${REPOS.web}/faq.html`, repo: 'web' },
    { path: `${REPOS.web}/mingle.html`, repo: 'web' },
    { path: `${REPOS.web}/network.html`, repo: 'web' },
    { path: `${REPOS.web}/world.html`, repo: 'web' },
    { path: `${REPOS.web}/agora.html`, repo: 'web' },
    { path: `${REPOS.web}/aivss.html`, repo: 'web' },
    { path: `${REPOS.web}/wallet.html`, repo: 'web' },
    { path: `${REPOS.web}/benchmarks.html`, repo: 'web' },
    { path: `${REPOS.web}/protocol-architecture.html`, repo: 'web' },  // v3 spec: STATS_PER_SCENE has 4 hardcoded TEST_COUNT + 1 in <b id="stat-c">
    { path: `${REPOS.web}/protocol.html`, repo: 'web' },                // v3 spec: TOTAL_MODULES, TEST_COUNT, MCP_TOOL_COUNT
    { path: `${REPOS.web}/working-group.html`, repo: 'web' },           // v3 spec: TEST_COUNT references
    { path: `${REPOS.web}/amcs.html`, repo: 'web' },                    // v3 spec: TEST_COUNT
    { path: `${REPOS.web}/README.md`, repo: 'web' },
    // Org profile README (if repo exists)
    ...(existsSync(`${REPOS.org}/profile/README.md`) ? [{ path: `${REPOS.org}/profile/README.md`, repo: 'org' }] : []),
    // Python SDK (v3 audit: was missing)
    ...(existsSync(`${REPOS.python}/README.md`) ? [
      { path: `${REPOS.python}/README.md`, repo: 'python' },
      { path: `${REPOS.python}/AGENTS.md`, repo: 'python' },
      { path: `${REPOS.python}/CLAUDE.md`, repo: 'python' },
      { path: `${REPOS.python}/llms.txt`, repo: 'python' },
      { path: `${REPOS.python}/pyproject.toml`, repo: 'python' },
    ] : []),
    // Vocabulary repo (v3 audit: was missing)
    ...(existsSync(`${REPOS.vocab}/README.md`) ? [
      { path: `${REPOS.vocab}/AGENTS.md`, repo: 'vocab' },
      { path: `${REPOS.vocab}/CLAUDE.md`, repo: 'vocab' },
      { path: `${REPOS.vocab}/llms.txt`, repo: 'vocab' },
    ] : []),
    // Ecosystem map repo (v3 audit: was missing)
    ...(existsSync(`${REPOS.ecomap}/README.md`) ? [
      { path: `${REPOS.ecomap}/README.md`, repo: 'ecomap' },
    ] : []),
    // .well-known/ files (v3 audit: was entirely missing)
    { path: `${REPOS.web}/.well-known/mcp.json`, repo: 'web' },
    { path: `${REPOS.web}/.well-known/aeoess-issuer.json`, repo: 'web' },
    { path: `${REPOS.web}/protocol-registry.json`, repo: 'web' },
    // Web repo — specs (agent-readable context)
    { path: `${REPOS.web}/specs/PROJECT-INSTRUCTIONS.md`, repo: 'web' },
    { path: `${REPOS.web}/specs/FILE-TREE.md`, repo: 'web' },
    { path: `${REPOS.web}/specs/ARCHITECTURE.md`, repo: 'web' },
    { path: `${REPOS.web}/UPDATE-PROPAGATION-SPEC.md`, repo: 'web' },
  ];
}

// ── Word-form number mapping ──
// Catches "twenty" when module count changes from 20 to 27, etc.
const WORD_FORMS = {
  8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve',
  13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen',
  17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
  21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four',
  25: 'twenty-five', 26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight',
  29: 'twenty-nine', 30: 'thirty', 31: 'thirty-one', 32: 'thirty-two',
  33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
  40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty',
};

function getWordFormPatterns(oldNum, newNum, suffix) {
  const oldWord = WORD_FORMS[Number(oldNum)];
  const newWord = WORD_FORMS[Number(newNum)];
  if (!oldWord || !newWord || oldWord === newWord) return [];
  const patterns = [];
  // "twenty protocol modules" → "twenty-seven protocol modules"
  if (suffix) {
    patterns.push({ regex: new RegExp(`${oldWord} ${suffix}`, 'gi'), replace: `${newWord} ${suffix}` });
  }
  // standalone "twenty" → "twenty-seven" (case-preserving)
  patterns.push({ regex: new RegExp(`\\b${oldWord}\\b`, 'g'), replace: newWord });
  // Capitalized: "Twenty" → "Twenty-seven"
  const oldCap = oldWord.charAt(0).toUpperCase() + oldWord.slice(1);
  const newCap = newWord.charAt(0).toUpperCase() + newWord.slice(1);
  patterns.push({ regex: new RegExp(`\\b${oldCap}\\b`, 'g'), replace: newCap });
  return patterns;
}

// ── Pattern generation ──
// Context-anchored patterns prevent false positives.
// Each variable has specific regex patterns that match ONLY the correct contexts.
// E.g., TEST_COUNT only matches "{N} tests" not "~{N} lines".
function getVariablePatterns(varName, oldValue, newValue) {
  const o = String(oldValue).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const n = String(newValue);

  switch (varName) {
    case 'SDK_VERSION':
      return [
        // v1.7.0, (v1.7.0), "v1.7.0", v1.7.0—, v1.7.0)
        { regex: new RegExp(`v${o}`, 'g'), replace: `v${n}` },
        // "version": "1.7.0" in package.json
        { regex: new RegExp(`"version":\\s*"${o}"`, 'g'), replace: `"version": "${n}"` },
        // softwareVersion":"1.7.0"
        { regex: new RegExp(`softwareVersion":"${o}"`, 'g'), replace: `softwareVersion":"${n}"` },
      ];

    case 'MCP_VERSION':
      return [
        // v2.1.0 in MCP-specific contexts
        { regex: new RegExp(`v${o}`, 'g'), replace: `v${n}` },
        { regex: new RegExp(`"version":\\s*"${o}"`, 'g'), replace: `"version": "${n}"` },
      ];

    case 'TEST_COUNT':
      return [
        // "214 tests" or "214 Tests" — case insensitive
        { regex: new RegExp(`${o} tests`, 'gi'), replace: `${n} tests` },
        // "214 test" (singular, less common)
        { regex: new RegExp(`${o} test(?!s|_| file)`, 'g'), replace: `${n} test` },
        // bare number in HTML stat elements: >214< (with class context)
        { regex: new RegExp(`"stat-val">${o}<`, 'g'), replace: `"stat-val">${n}<` },
        // bare number in table cells: <span class="y">214</span>
        { regex: new RegExp(`"y">${o}<`, 'g'), replace: `"y">${n}<` },
      ];

    case 'TEST_SUITES':
      return [
        // "55 suites"
        { regex: new RegExp(`${o} suites`, 'g'), replace: `${n} suites` },
      ];

    case 'TEST_FILES':
      return [
        // "15 test files"
        { regex: new RegExp(`${o} test files`, 'g'), replace: `${n} test files` },
      ];

    case 'MCP_TOOL_COUNT':
      return [
        // "30 tools"
        { regex: new RegExp(`${o} tools`, 'g'), replace: `${n} tools` },
        // "30 MCP tools"
        { regex: new RegExp(`${o} MCP tools`, 'g'), replace: `${n} MCP tools` },
      ];

    case 'LAYER_COUNT':
      return [
        // "27 protocol modules" / "27 protocol layers"
        { regex: new RegExp(`${o} protocol (modules|layers)`, 'g'), replace: `${n} protocol modules` },
        // "27 modules"
        { regex: new RegExp(`${o} modules`, 'g'), replace: `${n} modules` },
        // "27 layers" (legacy)
        { regex: new RegExp(`${o} layers`, 'g'), replace: `${n} layers` },
        // "all 27 modules" / "all 27 layers"
        { regex: new RegExp(`all ${o}`, 'g'), replace: `all ${n}` },
        // Word-form: "twenty-seven protocol modules" → uses word-form map
        ...getWordFormPatterns(o, n, 'protocol modules'),
      ];

    case 'ADVERSARIAL_COUNT':
      return [
        // "23 adversarial"
        { regex: new RegExp(`${o} adversarial`, 'g'), replace: `${n} adversarial` },
        // "23 attack scenarios"
        { regex: new RegExp(`${o} attack`, 'g'), replace: `${n} attack` },
      ];

    default:
      return [];
  }
}

function findStaleRefs(files, currentValues, previousValues) {
  const results = [];

  for (const { path: filePath, repo } of files) {
    if (!existsSync(filePath)) {
      results.push({ file: filePath, repo, status: 'missing' });
      continue;
    }

    const content = readFileSync(filePath, 'utf8');
    const fileResults = [];

    for (const [varName, newValue] of Object.entries(currentValues)) {
      if (newValue === null) continue;
      const oldValue = previousValues?.[varName];
      if (oldValue === undefined || oldValue === null) continue;
      if (String(oldValue) === String(newValue)) continue;

      const patterns = getVariablePatterns(varName, oldValue, newValue);

      for (const { regex } of patterns) {
        let match;
        const regexCopy = new RegExp(regex.source, regex.flags);
        while ((match = regexCopy.exec(content)) !== null) {
          const idx = match.index;
          const start = Math.max(0, idx - 40);
          const end = Math.min(content.length, idx + match[0].length + 40);
          const context = content.slice(start, end).replace(/\n/g, '↵');
          const lineNum = content.slice(0, idx).split('\n').length;

          fileResults.push({
            variable: varName,
            line: lineNum,
            oldValue: match[0],
            newValue: match[0].replace(regex, patterns.find(p => p.regex.source === regex.source).replace),
            context,
            pattern: regex.source,
          });
        }
      }
    }

    if (fileResults.length > 0) {
      results.push({ file: filePath, repo, status: 'stale', refs: fileResults });
    } else {
      results.push({ file: filePath, repo, status: 'ok' });
    }
  }

  return results;
}

// ── Verify pass (cache-independent drift detection) ──
// Fixes Bug 1 from spec PROPAGATE-SCRIPT-BUGS-2026-04-11: the cache-diff
// pass short-circuits when previous === current, so drift that was never
// rewritten stays invisible. This pass scans each target file with
// context-anchored regexes capturing the number, compares against current
// canonical, and reports any mismatch. Patterns are locked to the spec's
// "Regex false-positive notes" section — hardened against the false
// positives the first attempt produced (comma-formatted numbers,
// compound phrases like "20-tool profile", bare "N modules").

function getVerifyPatterns(varName) {
  switch (varName) {
    case 'TEST_COUNT':
      // Spec-locked: (?<![\d,])(\d{1,3}(?:,\d{3})+|\d+)\s+tests\b
      // Handles both comma-formatted ("2,764") and bare ("2764") numbers.
      // Lookbehind prevents matching "764" inside "2,764".
      return [
        { regex: /(?<![\d,])(\d{1,3}(?:,\d{3})+|\d+)\s+tests\b/gi },
      ];
    case 'MCP_TOOL_COUNT':
      // Spec-locked: (?<![\d-])(\d{2,4})(?!-)\s+tools\b
      // Negative lookbehind/lookahead for digit or hyphen prevents matching
      // "20-tool profile" (dash) or "120 tools" digit-preceded false cases.
      return [
        { regex: /(?<![\d-])(\d{2,4})(?!-)\s+tools\b/gi },
      ];
    case 'LAYER_COUNT':
      // Spec-locked: only match the full phrases "N protocol modules"
      // and "N total modules". Bare "N modules" is intentionally NOT
      // matched because it collides with "32 v2 modules" and similar.
      return [
        { regex: /(?<![\d-])(\d{2,4})(?!-)\s+protocol\s+modules\b/gi },
        { regex: /(?<![\d-])(\d{2,4})(?!-)\s+total\s+modules\b/gi },
      ];
    default:
      return [];
  }
}

// Returns an array of {start, end} absolute offsets into `content` that
// are safe to scan. If a file uses PROPAGATION-ZONE-START/END markers
// (blog.html etc.), only zone interiors are scannable. Otherwise the
// whole file is scannable. Mirrors applyReplacementsToContent zone logic.
function getScannableRanges(content) {
  const ZONE_START = '<!-- PROPAGATION-ZONE-START -->';
  const ZONE_END = '<!-- PROPAGATION-ZONE-END -->';
  if (!content.includes(ZONE_START)) return [{ start: 0, end: content.length }];
  const ranges = [];
  let cursor = 0;
  while (true) {
    const zs = content.indexOf(ZONE_START, cursor);
    if (zs === -1) break;
    const ze = content.indexOf(ZONE_END, zs);
    if (ze === -1) break;
    ranges.push({ start: zs + ZONE_START.length, end: ze });
    cursor = ze + ZONE_END.length;
  }
  return ranges;
}

// Format a number with thousands-separator commas if `useCommas` is true.
// Used to preserve comma-style when replacing a comma-formatted match.
function formatNumber(n, useCommas) {
  const s = String(n);
  if (!useCommas || s.length <= 3) return s;
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function verifyConsistency(files, currentValues) {
  const drifts = [];
  const checkVars = ['TEST_COUNT', 'MCP_TOOL_COUNT', 'LAYER_COUNT'];

  for (const { path: filePath, repo } of files) {
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, 'utf8');
    const ranges = getScannableRanges(content);

    for (const varName of checkVars) {
      const currentVal = currentValues[varName];
      if (currentVal === null || currentVal === undefined) continue;
      const patterns = getVerifyPatterns(varName);

      for (const { regex } of patterns) {
        for (const { start, end } of ranges) {
          const slice = content.slice(start, end);
          const regexCopy = new RegExp(regex.source, regex.flags);
          let match;
          while ((match = regexCopy.exec(slice)) !== null) {
            const foundStr = match[1];
            // Strip commas for numeric comparison.
            const foundNum = Number(foundStr.replace(/,/g, ''));
            if (foundNum === Number(currentVal)) continue;
            const absIdx = start + match.index;
            const lineNum = content.slice(0, absIdx).split('\n').length;
            drifts.push({
              file: filePath,
              repo,
              variable: varName,
              line: lineNum,
              found: foundStr,
              expected: currentVal,
              matched: match[0],
            });
          }
        }
      }
    }
  }
  return drifts;
}

function applyVerifyFixes(drifts) {
  // Group by file so we rewrite each file once, building zone-aware
  // replacement patterns that swap the exact matched substring with the
  // correct value (preserving comma-format when present).
  const byFile = new Map();
  for (const d of drifts) {
    if (!byFile.has(d.file)) byFile.set(d.file, []);
    byFile.get(d.file).push(d);
  }

  let fixed = 0;
  for (const [filePath, fileDrifts] of byFile) {
    const patterns = [];
    for (const d of fileDrifts) {
      const hasComma = d.found.includes(',');
      const newNumStr = formatNumber(d.expected, hasComma);
      const newMatch = d.matched.replace(d.found, newNumStr);
      const escaped = d.matched.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      patterns.push({ regex: new RegExp(escaped, 'g'), replace: newMatch });
    }
    let content = readFileSync(filePath, 'utf8');
    const before = content;
    content = applyReplacementsToContent(content, patterns);
    if (content !== before) {
      writeFileSync(filePath, content, 'utf8');
      fixed += fileDrifts.length;
    }
  }
  return fixed;
}

// ── Apply replacements ──
// If a file contains PROPAGATION-ZONE-START/END markers, only replace within zones.
// This protects historical blog entries from being overwritten with current numbers.
function applyReplacementsToContent(content, patterns) {
  const ZONE_START = '<!-- PROPAGATION-ZONE-START -->';
  const ZONE_END = '<!-- PROPAGATION-ZONE-END -->';

  if (!content.includes(ZONE_START)) {
    // No zones — process entire file (default behavior)
    for (const { regex, replace } of patterns) {
      content = content.replace(regex, replace);
    }
    return content;
  }

  // Zone-aware: only replace within PROPAGATION-ZONE markers
  const parts = [];
  let cursor = 0;
  let replacements = 0;
  while (true) {
    const zoneStart = content.indexOf(ZONE_START, cursor);
    if (zoneStart === -1) {
      parts.push(content.slice(cursor)); // remainder is protected
      break;
    }
    const zoneEnd = content.indexOf(ZONE_END, zoneStart);
    if (zoneEnd === -1) {
      parts.push(content.slice(cursor)); // unclosed zone, protect everything
      break;
    }
    // Protected content before zone
    parts.push(content.slice(cursor, zoneStart + ZONE_START.length));
    // Zone content — apply replacements
    let zone = content.slice(zoneStart + ZONE_START.length, zoneEnd);
    for (const { regex, replace } of patterns) {
      zone = zone.replace(regex, replace);
    }
    parts.push(zone);
    cursor = zoneEnd;
  }
  return parts.join('');
}

function applyReplacements(results, currentValues, previousValues) {
  let totalReplacements = 0;

  for (const result of results) {
    if (result.status !== 'stale') continue;

    let content = readFileSync(result.file, 'utf8');

    // Get unique variables that need replacement in this file
    const variables = [...new Set(result.refs.map(r => r.variable))];

    // Collect all patterns for this file
    const allPatterns = [];
    for (const varName of variables) {
      const oldValue = previousValues[varName];
      const newValue = currentValues[varName];
      const patterns = getVariablePatterns(varName, oldValue, newValue);
      allPatterns.push(...patterns);
    }

    // Apply with zone awareness (protects historical blog entries)
    const before = content;
    content = applyReplacementsToContent(content, allPatterns);
    // Count replacements by diffing
    for (const { regex } of allPatterns) {
      const matches = before.match(regex);
      if (matches) {
        const afterMatches = content.match(regex);
        totalReplacements += matches.length - (afterMatches?.length || 0);
      }
    }

    writeFileSync(result.file, content, 'utf8');
  }

  return totalReplacements;
}

// ── Main ──
const args = process.argv.slice(2);
const applyMode = args.includes('--apply');
const readOnlyMode = args.includes('--read-only');
const commitMode = args.includes('--commit');
const verifyOnlyMode = args.includes('--verify-only');
// Bug 1 patch: opt-in auto-fix for the verify-pass drift list.
// Restricted to LAYER_COUNT because TEST_COUNT and MCP_TOOL_COUNT
// regex patterns produce false positives on per-section counts
// (e.g., "13 tests" inside a subsystem coverage block, "20 tools"
// inside "the 20 tools 90% of integrations need").
const autoFixVerifyMode = args.includes('--auto-fix-verify');
// Roadmap auto-rebuild flags (apply-mode only). --force-roadmap-build
// forces a rebuild even if the YAML hash matches the cache (e.g. after
// build-roadmap.mjs itself changed). --skip-roadmap-build bypasses the
// rebuild check entirely for partial recovery / debugging.
const forceRoadmapBuildMode = args.includes('--force-roadmap-build');
const skipRoadmapBuildMode = args.includes('--skip-roadmap-build');

const modeLabel = readOnlyMode ? 'READ-ONLY'
  : verifyOnlyMode ? 'VERIFY-ONLY'
  : applyMode ? (commitMode ? 'APPLY + COMMIT' : 'APPLY')
  : 'DRY RUN';

console.log('╔══════════════════════════════════════════════╗');
console.log('║  AEOESS Update Propagation                  ║');
console.log(`║  Mode: ${modeLabel}                          ║`);
console.log('╚══════════════════════════════════════════════╝');
console.log('');

// Step 1: Read current source-of-truth values
const current = readSourceOfTruth();

console.log('');
console.log('Source of truth:');
for (const [k, v] of Object.entries(current)) {
  console.log(`  ${k}: ${v ?? '(unknown)'}`);
}
console.log('');

if (readOnlyMode) {
  process.exit(0);
}

// --verify-only: skip cache-diff entirely, run verify pass and exit.
// The verify pass is cache-independent so it works without loading cache.
if (verifyOnlyMode) {
  const files = getTargetFiles();
  console.log('Verify pass (cache-independent)...');
  const drifts = verifyConsistency(files, current);
  if (drifts.length === 0) {
    console.log('✅ Verify pass: all scanned surfaces match canonical values.');
    process.exit(0);
  }
  console.log(`⚠ Verify pass: found ${drifts.length} drift(s).`);
  for (const d of drifts) {
    const relPath = relative(REPOS.web + '/..', d.file);
    console.log(`   ${relPath}:${d.line}  ${d.variable} = ${d.found} (expected ${d.expected})  "${d.matched}"`);
  }
  process.exit(1);
}

// Roadmap auto-rebuild — fires only in apply mode so dry-run stays
// side-effect-free. Runs BEFORE the per-file scan so the regenerated
// roadmap.html is included in downstream drift detection.
if (applyMode && !skipRoadmapBuildMode) {
  runRoadmapBuild({ force: forceRoadmapBuildMode });
  console.log('');
} else if (applyMode && skipRoadmapBuildMode) {
  console.log('Roadmap: --skip-roadmap-build set, hash check bypassed.');
  console.log('');
}

// Step 2: Ask for previous values (what to search for)
// Read from a cache file if it exists, otherwise prompt
const cacheFile = `${REPOS.web}/scripts/.propagate-cache.json`;
let previous = {};

if (existsSync(cacheFile)) {
  previous = JSON.parse(readFileSync(cacheFile, 'utf8'));
  console.log('Previous values (from cache):');
  for (const [k, v] of Object.entries(previous)) {
    const changed = String(v) !== String(current[k]);
    console.log(`  ${k}: ${v}${changed ? ` → ${current[k]} ⚡` : ' (unchanged)'}`);
  }
} else {
  console.log('No cache file found. Creating with current values.');
  console.log('Next time you run, it will detect changes from these values.');
  writeFileSync(cacheFile, JSON.stringify(current, null, 2), 'utf8');
  console.log(`Saved to ${cacheFile}`);
  process.exit(0);
}

console.log('');

// Step 3: Find stale references
const files = getTargetFiles();
const results = findStaleRefs(files, current, previous);

// Step 4: Report
let staleCount = 0;
for (const result of results) {
  const relPath = relative(REPOS.web + '/..', result.file);

  if (result.status === 'stale') {
    console.log(`❌ ${relPath}`);
    for (const ref of result.refs) {
      console.log(`   L${ref.line}: ${ref.variable} "${ref.oldValue}" → "${ref.newValue}"`);
      console.log(`   ...${ref.context}...`);
    }
    staleCount += result.refs.length;
  } else if (result.status === 'missing') {
    console.log(`⚠  ${relPath} — file not found`);
  }
  // Don't print 'ok' files to reduce noise
}

console.log('');
if (staleCount === 0) {
  console.log('✅ All files are up to date!');
} else {
  console.log(`Found ${staleCount} stale reference(s).`);

  if (applyMode) {
    const replaced = applyReplacements(results, current, previous);
    console.log(`✅ Applied ${replaced} replacement(s).`);

    // Update cache with new values
    writeFileSync(cacheFile, JSON.stringify(current, null, 2), 'utf8');
    console.log('Cache updated.');

    // Auto-commit and push all repos if --commit flag is set
    if (commitMode) {
      console.log('');
      console.log('Committing and pushing all repos...');
      const msg = `propagate: SDK v${current.SDK_VERSION}, MCP v${current.MCP_VERSION}, ${current.TEST_COUNT} tests, ${current.MCP_TOOL_COUNT} tools`;
      for (const [name, repoPath] of Object.entries(REPOS)) {
        try {
          // Check if there are staged or unstaged changes
          const status = execSync('git status --porcelain', { cwd: repoPath, encoding: 'utf8' }).trim();
          if (status) {
            execSync(`git add -A && git commit -m "${msg}"`, { cwd: repoPath, encoding: 'utf8' });
            execSync('git push', { cwd: repoPath, encoding: 'utf8', timeout: 30000 });
            console.log(`  ✅ ${name}: committed and pushed`);
          } else {
            console.log(`  ⏭  ${name}: no changes`);
          }
        } catch (e) {
          console.log(`  ❌ ${name}: ${e.message?.slice(0, 100)}`);
        }
      }
      // Update GitHub repo "About" descriptions via gh CLI
      try {
        const ghPath = `${HOME}/.local/bin/gh`;
        if (existsSync(ghPath)) {
          const sdkDesc = `Cryptographic identity, delegation, governance, and commerce protocol for AI agents. Ed25519 signatures, ${current.LAYER_COUNT} protocol modules, ${current.TEST_COUNT} tests. npm install agent-passport-system`;
          const mcpDesc = `MCP server for the Agent Passport System. ${current.MCP_TOOL_COUNT} tools across ${current.LAYER_COUNT} modules. Any MCP client gets full protocol access. npx agent-passport-system-mcp`;
          execSync(`${ghPath} repo edit aeoess/agent-passport-system --description "${sdkDesc}"`, { encoding: 'utf8', timeout: 15000 });
          execSync(`${ghPath} repo edit aeoess/agent-passport-mcp --description "${mcpDesc}"`, { encoding: 'utf8', timeout: 15000 });
          console.log('  ✅ GitHub "About" descriptions updated');
        }
      } catch (e) {
        console.log(`  ⚠️  gh repo edit: ${e.message?.slice(0, 100)}`);
      }
    }
  } else {
    console.log('Run with --apply to fix them.');
  }
}

// Step 5: Cache-independent verify pass — REPORT ONLY in normal/apply mode.
// Catches drift the cache-diff pass misses (Bug 1 short-circuit described
// in spec PROPAGATE-SCRIPT-BUGS-2026-04-11). The locked spec patterns
// produce false positives on per-feature test counts ("13 tests" in a
// section about a specific subsystem), per-test-file counts in code
// comments, profile-size mentions ("the 20 tools 90% of integrations
// need"), and historical update-box entries in index.html that have no
// PROPAGATION-ZONE markers. Until those false positives are eliminated
// (requires either pattern refinement or copy normalization), the auto
// -fix path is intentionally NOT wired into normal/apply mode. Use
// --verify-only to dry-run the report. applyVerifyFixes() exists in
// the file for the day patterns are tight enough to safely auto-fix.
console.log('');
console.log('Verify pass (cache-independent)...');
const drifts = verifyConsistency(files, current);
if (drifts.length === 0) {
  console.log('✅ Verify pass: all scanned surfaces match canonical values.');
} else {
  console.log(`⚠ Verify pass: found ${drifts.length} drift(s).`);
  console.log('   (mix of real drift and known false positives — see UPDATE-PROPAGATION-SPEC.md)');
  for (const d of drifts) {
    const relPath = relative(REPOS.web + '/..', d.file);
    console.log(`   ${relPath}:${d.line}  ${d.variable} = ${d.found} (expected ${d.expected})  "${d.matched}"`);
  }
  // Bug 1 patch: auto-fix on opt-in, restricted to LAYER_COUNT.
  // The cache-diff pass at line ~664 short-circuits when previous === current,
  // missing on-disk drift. The verify pass catches it; --auto-fix-verify
  // closes it on the safe-pattern subset.
  if (applyMode && autoFixVerifyMode) {
    const safe = drifts.filter(d => d.variable === 'LAYER_COUNT');
    const skipped = drifts.length - safe.length;
    if (safe.length > 0) {
      const fixed = applyVerifyFixes(safe);
      console.log(`✅ Auto-fixed ${fixed} LAYER_COUNT drift(s) (--auto-fix-verify).`);
    }
    if (skipped > 0) {
      console.log(
        `⚠ ${skipped} TEST_COUNT/MCP_TOOL_COUNT drift(s) NOT auto-fixed ` +
        `(known false-positive patterns; review and edit manually).`
      );
    }
  } else if (drifts.length > 0) {
    console.log('Auto-fix is opt-in: re-run with --apply --auto-fix-verify to close LAYER_COUNT drift.');
  }
}
