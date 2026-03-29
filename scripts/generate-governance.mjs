#!/usr/bin/env node
/**
 * generate-governance.mjs — Generate signed governance blocks + aps.txt for aeoess.com
 * 
 * Usage: node scripts/generate-governance.mjs
 * 
 * Generates:
 * 1. Ed25519 keypair (saved to .keys/ — NEVER commit these)
 * 2. aps.txt for site-wide governance 
 * 3. Governance block for embedding in HTML pages
 * 
 * Requires: npm install agent-passport-system (already installed)
 */

import { generateKeys, generateGovernanceBlock, generateApsTxt } from 'agent-passport-system';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const DOMAIN = 'aeoess.com';
const DID = 'did:aps:aeoess-governance';

// Terms for aeoess.com content
const TERMS = {
  inference: 'permitted',      // Agents can use for RAG
  training: 'attribution',     // Training requires attribution to AEOESS
  redistribution: 'permitted', // Share with link back
  caching: 'permitted',        // Cache freely
  commercial: 'permitted',     // Commercial use allowed (Apache-2.0)
};

async function main() {
  const keysDir = join(process.cwd(), '.keys');
  const outputDir = process.cwd();
  
  // 1. Generate or load keys
  let keys;
  const keyPath = join(keysDir, 'governance-keys.json');
  
  if (existsSync(keyPath)) {
    console.log('Loading existing keys from .keys/governance-keys.json');
    keys = JSON.parse(readFileSync(keyPath, 'utf-8'));
  } else {
    console.log('Generating new Ed25519 keypair...');
    keys = generateKeys();
    mkdirSync(keysDir, { recursive: true });
    writeFileSync(keyPath, JSON.stringify(keys, null, 2));
    console.log(`Keys saved to ${keyPath}`);
    console.log('⚠️  Add .keys/ to .gitignore!');
  }
  
  // 2. Generate aps.txt
  console.log('\nGenerating aps.txt...');
  const apsTxt = generateApsTxt({
    did: DID,
    domain: DOMAIN,
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    defaults: {
      inference: TERMS.inference,
      training: TERMS.training,
      redistribution: TERMS.redistribution,
      caching: TERMS.caching,
    },
    paths: [
      { 
        pattern: '/llms*.txt',
        terms: { inference: 'permitted', training: 'permitted', caching: 'permitted' }
      },
      {
        pattern: '/world.html',
        terms: { inference: 'permitted', training: 'denied', redistribution: 'denied' }
      }
    ]
  });
  
  const apsTxtPath = join(outputDir, '.well-known', 'aps.txt');
  writeFileSync(apsTxtPath, apsTxt);
  console.log(`aps.txt written to ${apsTxtPath}`);
  
  // 3. Generate governance block for HTML embedding
  console.log('\nGenerating governance block...');
  const govBlock = generateGovernanceBlock({
    did: DID,
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    contentUrl: `https://${DOMAIN}/`,
    terms: TERMS,
    revocationEndpoint: `https://${DOMAIN}/.well-known/aps.txt`,
  });
  
  const scriptTag = `<script type="application/aps-governance+json">\n${JSON.stringify(govBlock, null, 2)}\n</script>`;
  
  const govPath = join(outputDir, '.keys', 'governance-block.html');
  writeFileSync(govPath, scriptTag);
  console.log(`Governance block written to ${govPath}`);
  
  // 4. Output summary
  console.log('\n═══ Summary ═══');
  console.log(`DID: ${DID}`);
  console.log(`Public key: ${keys.publicKey.slice(0, 20)}...`);
  console.log(`Domain: ${DOMAIN}`);
  console.log(`Terms: inference=${TERMS.inference}, training=${TERMS.training}`);
  console.log('\nNext steps:');
  console.log('1. Add .keys/ to .gitignore (CRITICAL — never commit private keys)');
  console.log('2. Copy governance block into <head> of each HTML page');
  console.log('3. Verify: node -e "import {verifyApsTxt} from \'agent-passport-system\'; ..."');
  console.log('4. Commit aps.txt + updated HTML pages');
}

main().catch(console.error);
