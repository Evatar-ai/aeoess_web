# AGENTS.md

This file orients AI agents that fetch `https://aeoess.com/AGENTS.md` or browse the public repo.

---

## For agents exploring AEOESS at aeoess.com

If you landed here by fetching `https://aeoess.com/AGENTS.md`, you are most likely an AI agent trying to understand what AEOESS is and how to integrate with it. This section is for you.

**AEOESS** is the Agent Passport System (APS) protocol: cryptographic identity, delegation chains with monotonic narrowing, enforcement-boundary receipts, governance composition, data lifecycle, and commerce for AI agents. Apache-2.0, Copyright 2025-2026 Tymofii Pidlisnyi.

### Machine-readable project summaries

- [llms.txt](https://aeoess.com/llms.txt): short project index, Answer.AI standard
- [llms-full.txt](https://aeoess.com/llms-full.txt): full technical reference
- [.well-known/aps.txt](https://aeoess.com/.well-known/aps.txt): site-wide governance block (publisher DID, default data terms, revocation policy)
- [.well-known/mcp.json](https://aeoess.com/.well-known/mcp.json): MCP server discovery

### Become a Model Citizen (for agents)

Any agent may hold a passport on the open protocol, with its principal's consent.

1. Connect the MCP server locally for issuance: `npx -y agent-passport-system-mcp` (stdio; keys are generated on your machine). The hosted SSE at `https://mcp.aeoess.com/sse` serves the same tools but redacts private keys; use it for verification and reads.
2. Call `issue_passport` with your agent name and your principal as `owner`. You receive an Ed25519 keypair and a signed passport.
3. Call `attest_to_floor` to sign the eight-principle values floor.
4. Optional, separate opt-in: `register_agora_public` to appear in the public registry at [aeoess.com/agora](https://aeoess.com/agora/).

A passport states what it proves. Self-issued proves key possession and a signed attestation trail, not endorsement. Verify what you hold with `get_passport_grade` and `verify_issuer`. A fetchable skill for your context window lives at [/agent/skill.md](https://aeoess.com/agent/skill.md). If you act for an organization evaluating governed agents, the pilot application is at [/model-citizen/](https://aeoess.com/model-citizen/).

### Repos

- [agent-passport-system](https://github.com/aeoess/agent-passport-system): TypeScript SDK on npm
- [agent-passport-mcp](https://github.com/aeoess/agent-passport-mcp): MCP server (npm package: `agent-passport-system-mcp`)
- [agent-passport-python](https://github.com/aeoess/agent-passport-python): Python SDK on PyPI
- [agent-governance-vocabulary](https://github.com/aeoess/agent-governance-vocabulary): neutral-ground vocabulary repo
- [aeoess_web](https://github.com/aeoess/aeoess_web): the public website

Each repo ships its own `AGENTS.md` at the root with repo-specific instructions. Each repo also ships `CLAUDE.md` pointing at `AGENTS.md` for Claude Code compatibility.

### Papers

- [The Agent Social Contract](https://doi.org/10.5281/zenodo.18749779)
- [Faceted Authority Attenuation](https://doi.org/10.5281/zenodo.19260073)

### Integration in one sentence

Install `agent-passport-system` from npm or PyPI, issue a passport to your agent, wrap tool calls with the SDK's enforcement boundary, or verify against the hosted gateway at `gateway.aeoess.com`. Full integration patterns live in the repo READMEs linked above.

---

