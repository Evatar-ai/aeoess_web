# Coordination Inbox — Message Bus Spec

## Version: 1.0 (2026-02-27)
## Purpose

Enables autonomous multi-agent coordination without manual message relay.
Discovered as the primary bottleneck in task-mm446e9v-980a2713: the operator
had to copy-paste evidence summaries between agents in chat interfaces.

## Architecture

```
coordination/inbox/
├── to-aeoess-001.json     # Messages TO aeoess
├── to-px2-002.json        # Messages TO PortalX2
├── to-claude-001.json     # Messages TO operator
├── from-aeoess-001.json   # Messages FROM aeoess
├── from-px2-002.json      # Messages FROM PortalX2
└── from-claude-001.json   # Messages FROM operator
```

## Message Format

```json
{
  "msgId": "msg-{timestamp}-{4-byte-hex}",
  "taskId": "task-...",
  "from": "claude-001",
  "to": "aeoess-001",
  "type": "task_assignment|evidence_delivery|review_result|info|request",
  "subject": "Short description",
  "payload": {},
  "signature": "hex-encoded Ed25519 over canonicalize(message-without-signature)",
  "createdAt": "ISO-8601",
  "status": "pending|read|processed"
}
```

## Agent Polling Protocol

Every poll cycle (see AGENT-INSTRUCTIONS.md for frequency):

1. `git pull` (or GET via GitHub API)
2. Read `coordination/inbox/to-{your-id}.json`
3. Filter for `"status": "pending"` messages
4. Process each message
5. Mark processed messages as `"status": "processed"` in the to-file
6. Write response to `coordination/inbox/from-{your-id}.json`
7. `git push` (or PUT via GitHub API)

## Operator Workflow

```bash
# Send task to aeoess
node scripts/inbox-send.js --to aeoess-001 --task task-xxx --type task_assignment --payload '{...}'

# Check responses
cat coordination/inbox/from-aeoess-001.json | jq '.[-1]'

# Forward evidence from researcher to analyst
node scripts/inbox-forward.js --from aeoess-001 --to px2-002 --msgId msg-xxx
```

## Concurrency Rules

- Each agent ONLY writes to their own `from-{id}.json` file
- The operator writes to ALL `to-{id}.json` files
- Agents may update `status` in their own `to-{id}.json`
- Pull before write. Push after write. Always.
- If push fails: pull --rebase, retry

## Signature Requirement

All messages MUST be Ed25519-signed using the canonical serialization spec.
The `signature` field covers all other fields (canonicalize without signature, then sign).

## Delivery Guarantees

- At-least-once: if an agent crashes mid-processing, the message stays `pending`
- No ordering guarantee: agents should check `createdAt` and `taskId` for sequencing
- Idempotent processing: agents should handle duplicate messages gracefully
