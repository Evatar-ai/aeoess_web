#!/usr/bin/env node
/**
 * inbox-check.js — Check pending messages for an agent
 * 
 * Usage:
 *   node inbox-check.js aeoess-001    # Check aeoess's inbox
 *   node inbox-check.js px2-002       # Check PortalX2's inbox
 *   node inbox-check.js --all         # Check all inboxes
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INBOX_DIR = resolve(__dirname, '../inbox');

const target = process.argv[2];

function checkInbox(agentId) {
  const toPath = resolve(INBOX_DIR, `to-${agentId}.json`);
  const fromPath = resolve(INBOX_DIR, `from-${agentId}.json`);
  
  let toMsgs = [], fromMsgs = [];
  try { toMsgs = JSON.parse(readFileSync(toPath, 'utf8')); } catch {}
  try { fromMsgs = JSON.parse(readFileSync(fromPath, 'utf8')); } catch {}
  
  const pending = toMsgs.filter(m => m.status === 'pending');
  
  console.log(`\n📬 ${agentId}:`);
  console.log(`   Inbox: ${toMsgs.length} total, ${pending.length} pending`);
  console.log(`   Outbox: ${fromMsgs.length} responses`);
  
  if (pending.length > 0) {
    pending.forEach(m => {
      console.log(`   📩 [${m.type}] ${m.subject} (from ${m.from}, ${m.createdAt})`);
    });
  }
}

if (target === '--all') {
  const files = readdirSync(INBOX_DIR).filter(f => f.startsWith('to-') && f.endsWith('.json'));
  files.forEach(f => {
    const agentId = f.replace('to-', '').replace('.json', '');
    checkInbox(agentId);
  });
} else if (target) {
  checkInbox(target);
} else {
  console.log('Usage: node inbox-check.js <agent-id> | --all');
}
