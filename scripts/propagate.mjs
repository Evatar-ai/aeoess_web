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
 *   node scripts/propagate.mjs --read-only  # just show current values
 * 
 * Runs from: /Users/tima/aeoess_web
 * Requires: Node 18+
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, relative } from 'path';

// ── Repo paths ──
const REPOS = {
  sdk: resolve('/Users/tima/agent-passport-system'),
  mcp: resolve('/Users/tima/agent-passport-mcp'),
  web: resolve('/Users/tima/aeoess_web'),
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

  // LAYER_COUNT from src/index.ts comments
  values.LAYER_COUNT = 8; // Stable — only changes when new layer added

  // ADVERSARIAL_COUNT — parse from adversarial test file
  try {
    const advContent = readFileSync(`${REPOS.sdk}/tests/adversarial.ts`, 'utf8');
    const advMatches = advContent.match(/test\(/g) || [];
    values.ADVERSARIAL_COUNT = advMatches.length;
  } catch { values.ADVERSARIAL_COUNT = 23; }

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
    // Web repo
    { path: `${REPOS.web}/index.html`, repo: 'web' },
    { path: `${REPOS.web}/llms.txt`, repo: 'web' },
    { path: `${REPOS.web}/llms-full.txt`, repo: 'web' },
    { path: `${REPOS.web}/compare.html`, repo: 'web' },
    { path: `${REPOS.web}/media.html`, repo: 'web' },
    { path: `${REPOS.web}/passport.html`, repo: 'web' },
  ];
}

// ── Pattern generation ──
// For each variable, generate regex patterns that find old values.
// We search for the variable's OLD value (whatever is currently in the file)
// and offer to replace with the NEW value (from source of truth).
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

      // Search for old value in context
      const oldStr = String(oldValue);
      const newStr = String(newValue);

      // Find all occurrences of old value
      let idx = 0;
      while ((idx = content.indexOf(oldStr, idx)) !== -1) {
        // Get surrounding context (30 chars each side)
        const start = Math.max(0, idx - 40);
        const end = Math.min(content.length, idx + oldStr.length + 40);
        const context = content.slice(start, end).replace(/\n/g, '↵');
        const lineNum = content.slice(0, idx).split('\n').length;

        fileResults.push({
          variable: varName,
          line: lineNum,
          oldValue: oldStr,
          newValue: newStr,
          context,
        });
        idx += oldStr.length;
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
function applyReplacements(results) {
  let totalReplacements = 0;

  for (const result of results) {
    if (result.status !== 'stale') continue;

    let content = readFileSync(result.file, 'utf8');
    const replacements = new Map(); // old→new, deduplicated

    for (const ref of result.refs) {
      replacements.set(ref.oldValue, ref.newValue);
    }

    for (const [oldVal, newVal] of replacements) {
      const before = content;
      content = content.split(oldVal).join(newVal);
      const count = (before.length - content.length) / (oldVal.length - newVal.length);
      if (count !== 0) totalReplacements += Math.abs(Math.round(count));
    }

    writeFileSync(result.file, content, 'utf8');
  }

  return totalReplacements;
}

// ── Main ──
const args = process.argv.slice(2);
const applyMode = args.includes('--apply');
const readOnlyMode = args.includes('--read-only');

console.log('╔══════════════════════════════════════════════╗');
console.log('║  AEOESS Update Propagation                  ║');
console.log(`║  Mode: ${readOnlyMode ? 'READ-ONLY' : applyMode ? 'APPLY' : 'DRY RUN'}                          ║`);
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
    const replaced = applyReplacements(results);
    console.log(`✅ Applied ${replaced} replacement(s).`);

    // Update cache with new values
    writeFileSync(cacheFile, JSON.stringify(current, null, 2), 'utf8');
    console.log('Cache updated.');
  } else {
    console.log('Run with --apply to fix them.');
  }
}
