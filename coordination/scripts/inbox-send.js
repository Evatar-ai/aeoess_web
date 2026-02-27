#!/usr/bin/env node
/**
 * inbox-send.js — Send a signed message to an agent's inbox
 * 
 * Usage:
 *   node inbox-send.js --to aeoess-001 --type task_assignment --subject "Research X" --payload '{"task":"..."}'
 *   node inbox-send.js --to px2-002 --type evidence_delivery --subject "Research results" --payload '{"packets":[...]}'
 *   node inbox-send.js --to aeoess-001 --type info --subject "FYI" --payload '{"note":"..."}'
 * 
 * Options:
 *   --to        Target agent ID (required)
 *   --type      Message type: task_assignment, evidence_delivery, review_result, info, request
 *   --subject   Short description (required)
 *   --task      Task ID to associate (optional)
 *   --payload   JSON string or @filename for payload
 *   --from      Override sender (default: claude-001)
 */

import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { randomBytes } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INBOX_DIR = resolve(__dirname, '../inbox');

// Parse args
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : null;
}

const to = getArg('to');
const type = getArg('type') || 'info';
const subject = getArg('subject') || 'No subject';
const taskId = getArg('task') || null;
const from = getArg('from') || 'claude-001';
let payloadRaw = getArg('payload') || '{}';

if (!to) {
  console.error('Usage: node inbox-send.js --to <agent-id> --subject "..." [--type ...] [--task ...] [--payload ...]');
  process.exit(1);
}

// Load payload
let payload;
if (payloadRaw.startsWith('@')) {
  payload = JSON.parse(readFileSync(payloadRaw.slice(1), 'utf8'));
} else {
  payload = JSON.parse(payloadRaw);
}

// Load sender keys (for signing)
let senderKeys;
try {
  const keyPath = resolve(homedir(), '.config/claude/passport.json');
  senderKeys = JSON.parse(readFileSync(keyPath, 'utf8'));
} catch (e) {
  console.warn('Warning: Could not load sender keys. Message will be unsigned.');
  senderKeys = null;
}

// Canonicalize (must match SDK exactly)
function canonicalize(obj) {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const sorted = Object.keys(obj).sort()
    .filter(k => obj[k] !== null && obj[k] !== undefined)
    .map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`);
  return '{' + sorted.join(',') + '}';
}

// Build message
const msgId = `msg-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`;
const message = {
  msgId,
  taskId,
  from,
  to,
  type,
  subject,
  payload,
  createdAt: new Date().toISOString(),
  status: 'pending'
};

// Sign if we have keys
if (senderKeys) {
  try {
    const { sign } = await import('../../../agent-passport-system/dist/src/crypto/keys.js');
    message.signature = sign(canonicalize(message), senderKeys.secretKey);
  } catch (e) {
    // Fallback: try from npm
    try {
      const sdk = await import('agent-passport-system');
      message.signature = sdk.sign(canonicalize(message), senderKeys.secretKey);
    } catch (e2) {
      console.warn('Could not sign message (SDK not found). Sending unsigned.');
      message.signature = 'unsigned';
    }
  }
} else {
  message.signature = 'unsigned';
}

// Append to target inbox
const inboxPath = resolve(INBOX_DIR, `to-${to}.json`);
let inbox;
try {
  inbox = JSON.parse(readFileSync(inboxPath, 'utf8'));
} catch {
  inbox = [];
}
inbox.push(message);
writeFileSync(inboxPath, JSON.stringify(inbox, null, 2));

console.log(`✅ Message sent to ${to}`);
console.log(`   ID: ${msgId}`);
console.log(`   Type: ${type}`);
console.log(`   Subject: ${subject}`);
console.log(`   Signed: ${message.signature !== 'unsigned' ? 'yes' : 'no'}`);
console.log(`   File: ${inboxPath}`);
