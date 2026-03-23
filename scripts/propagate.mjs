#!/usr/bin/env node
/**
 * propagate.mjs — Auto-propagate version/test/tool numbers across all repos.
 * 
 * Reads source-of-truth values from package.json files and test output,
 * then finds and replaces stale references across all files listed in
 * UPDATE-PROPAGATION-SPEC.md.
 * 
 * Usage:
 *   node scripts/propagate.mjs              # dry run (show what would change)
 *   node scripts/propagate.mjs --apply      # actually replace
 *   node scripts/propagate.mjs --apply --commit  # replace + git commit + push all repos
 *   node scripts/propagate.mjs --read-only  # just show current values
 * 
 * Runs from: /Users/tima/aeoess_web
 * Requires: Node 18+
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, relative } from 'path';

// ── Repo paths (portable — works on Air or Mini) ──
const HOME = process.env.HOME || '/Users/tima';
const REPOS = {
  sdk: resolve(`${HOME}/agent-passport-system`),
  mcp: resolve(`${HOME}/agent-passport-mcp`),
  web: resolve(`${HOME}/aeoess_web`),
  org: resolve(`${HOME}/aeoess-dot-github`), // GitHub org profile README
};

// ── Read source-of-truth values ──
function readSourceOfTruth() {
  const values = {};

  // SDK_VERSION from package.json
  const sdkPkg = JSON.parse(readFileSync(`${REPOS.sdk}/package.json`, 'utf8'));
  values.SDK_VERSION = sdkPkg.version;

  // MCP_VERSION from package.json
  const mcpPkg = JSON.parse(readFileSync(`${REPOS.mcp}/package.json`, 'utf8'));
  values.MCP_VERSION = mcpPkg.version;

  // TEST_FILES from package.json test script
  const testScript = sdkPkg.scripts?.test || '';
  const testFiles = testScript.match(/tests\/[\w.-]+\.ts/g) || [];
  values.TEST_FILES = testFiles.length;

  // LAYER_COUNT from actual source module count (src/core/*.ts minus index.ts)
  try {
    const coreFiles = readdirSync(`${REPOS.sdk}/src/core`).filter(f => f.endsWith('.ts') && f !== 'index.ts');
    values.LAYER_COUNT = coreFiles.length;
  } catch { values.LAYER_COUNT = 27; }

  // ADVERSARIAL_COUNT — count across ALL adversarial test files
  try {
    const advFiles = readdirSync(`${REPOS.sdk}/tests`).filter(f => f.startsWith('adversarial'));
    let total = 0;
    for (const f of advFiles) {
      const content = readFileSync(`${REPOS.sdk}/tests/${f}`, 'utf8');
      const matches = content.match(/it\(/g) || [];
      total += matches.length;
    }
    values.ADVERSARIAL_COUNT = total || 73;
  } catch { values.ADVERSARIAL_COUNT = 73; }

  // MCP_TOOL_COUNT — count server.tool( calls in MCP source
  try {
    const mcpSrc = readFileSync(`${REPOS.mcp}/src/index.ts`, 'utf8');
    const toolMatches = mcpSrc.match(/server\.tool\(/g) || [];
    values.MCP_TOOL_COUNT = toolMatches.length;
  } catch { values.MCP_TOOL_COUNT = 30; }

  // TEST_COUNT and TEST_SUITES — run tests and parse output
  try {
    console.log('Running SDK tests to get counts...');
    const testOutput = execSync('npm test 2>&1', {
      cwd: REPOS.sdk,
      encoding: 'utf8',
      timeout: 60000,
    });

    // Parse: "tests 196 | suites 51 | pass 196"
    const testCountMatch = testOutput.match(/tests\s+(\d+)/);
    const suitesMatch = testOutput.match(/suites\s+(\d+)/);
    values.TEST_COUNT = testCountMatch ? parseInt(testCountMatch[1]) : null;
    values.TEST_SUITES = suitesMatch ? parseInt(suitesMatch[1]) : null;

    if (!values.TEST_COUNT) {
      // Fallback: count "ok" lines
      const okLines = testOutput.match(/^ok \d+/gm) || [];
      values.TEST_COUNT = okLines.length || null;
    }
    if (!values.TEST_SUITES) {
      // Fallback: count "# Subtest:" lines
      const subtests = testOutput.match(/# Subtest:/g) || [];
      values.TEST_SUITES = subtests.length || null;
    }
  } catch (e) {
    console.log('⚠ Could not run tests. Using --skip-tests or provide values manually.');
    console.log(`  Error: ${e.message?.slice(0, 100)}`);
    values.TEST_COUNT = null;
    values.TEST_SUITES = null;
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
    // MCP repo
    { path: `${REPOS.mcp}/README.md`, repo: 'mcp' },
    { path: `${REPOS.mcp}/package.json`, repo: 'mcp' },
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
    { path: `${REPOS.web}/overview.html`, repo: 'web' },
    { path: `${REPOS.web}/mingle.html`, repo: 'web' },
    { path: `${REPOS.web}/network.html`, repo: 'web' },
    { path: `${REPOS.web}/world.html`, repo: 'web' },
    { path: `${REPOS.web}/README.md`, repo: 'web' },
    // Org profile README (if repo exists)
    ...(existsSync(`${REPOS.org}/profile/README.md`) ? [{ path: `${REPOS.org}/profile/README.md`, repo: 'org' }] : []),
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

console.log('╔══════════════════════════════════════════════╗');
console.log('║  AEOESS Update Propagation                  ║');
console.log(`║  Mode: ${readOnlyMode ? 'READ-ONLY' : applyMode ? (commitMode ? 'APPLY + COMMIT' : 'APPLY') : 'DRY RUN'}                          ║`);
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
