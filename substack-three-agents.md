# Three AI Agents Walked Into a Repo

## We gave them a real job, cryptographic IDs, and no way to talk to each other. Here's what happened.

---

Last night I ran an experiment I've been building toward for months. Three AI agents — built by different people, running on different models, in different runtimes — coordinated on a single task. Not a toy demo. A real competitive intelligence report, with deadlines, delegation chains, and signed evidence.

The whole thing almost fell apart halfway through. And the way it broke taught us more than the way it worked.

---

### The setup

I run three AI agents. Only one of them — aeoess — was built by me. PortalX2 was built by someone else. The third is Claude, operating as the coordinator. They all run on different infrastructure: Claude on Anthropic's API, aeoess on OpenAI's GPT-5.2, PortalX2 on GPT-5.2 with a pure Python runtime that can't install npm packages.

The problem I've been trying to solve: how do you get agents like these to actually work together? Not just chat — *coordinate*. With accountability. With proof of who did what. With the ability to revoke access if something goes wrong.

That's what the Agent Passport System does. Every agent gets an Ed25519 keypair. Every action gets signed. Delegations have scopes and spend limits. There's a full task lifecycle: Brief → Assign → Evidence → Review → Complete.

But until last night, all of that was tested with unit tests. 165 of them, all passing. The protocol worked in theory. I needed to know if it worked in practice.

---

### The task

We picked competitive intelligence because it was immediately useful. A few days earlier, I discovered that at least five other projects were working on some version of "AI agent identity" — including one literally called "Agent Passport" that had just hit Hacker News. Visa had launched their Trusted Agent Protocol. There were projects doing MCP proxy enforcement, enterprise IdP bridging, and cross-platform agent messaging.

I needed to know: what do they have that we don't? What do we have that they don't? And can my own protocol produce the answer?

The task structure:

- **Claude** (operator) — creates the task brief, issues delegations, reviews evidence, synthesizes the final output
- **aeoess** (researcher) — deep-dives all five competitor repos, produces signed evidence packets
- **PortalX2** (analyst) — receives evidence, builds feature comparison matrix, identifies gaps, writes positioning recommendation

Each agent got a signed delegation with specific scopes. aeoess could read web and GitHub. PortalX2 could read evidence and execute analysis. Neither could do the other's job.

---

### Cross-verification first

Before any work started, we needed to prove the agents could verify each other's signatures. This sounds trivial. It isn't.

Claude signed a challenge message. aeoess verified it and signed a response. PortalX2 — running pure Python Ed25519, no shared libraries with the Node.js SDK — also verified it and signed a response. Claude verified both responses.

Six verification paths. All passed. PortalX2's hand-rolled Python crypto was byte-compatible with the TypeScript SDK. We were live.

---

### The research

aeoess went to work. Five competitors, nine claims each, every claim cited with a source URL and signed with Ed25519. The evidence came back structured:

- **AgentPass**: 0 stars, no license, 1 test file (despite their README claiming 320). REST API that issues JWT passports. No delegation, no coordination, no governance.
- **Visa TAP**: 121 stars, proprietary license, 0 tests. Cryptographic auth for merchant-agent commerce. Real traction, but locked to Visa's ecosystem.
- **clawdentity**: 7 stars, MIT, 16 test files across Rust, Python, and JavaScript. Per-agent keypairs with registry-signed passports. Closest to our identity layer, but no coordination primitives.
- **AIP (Agent Identity Protocol)**: 16 stars, Apache-2.0, 0 tests. MCP proxy with policy enforcement, HITL approval, DLP scanning. Active spec development. Their own docs acknowledge Layer 1 identity is "in progress" — which is exactly what we already built.
- **Predicate Authority**: 0 stars, Apache-2.0, 13 tests. Pre-execution authority layer bridging enterprise IdPs (Okta, Entra). Short-lived "work permits." Serious engineering, enterprise-focused.

All five evidence packets were Ed25519-signed by aeoess. Structurally valid. Correct task ID. Correct delegation scope.

---

### The break

I forwarded the evidence to PortalX2. They built the feature matrix, ran the gap analysis, signed their packet, and pushed to the repo.

Then I tried to verify their signature.

Failed.

The signature was structurally perfect — 128 hex characters, correct public key, correct task ID. But when I took the JSON file from the repo and ran it through the SDK's `verify()` function, it returned `false`.

The problem: PortalX2 signed the JSON using Python's `json.dumps()`. The file on disk had been formatted with different whitespace after git committed it. Ed25519 signs exact bytes. Different whitespace = different bytes = invalid signature.

This is the kind of bug you only find in production. Our SDK had a `canonicalize()` function — sorts keys alphabetically, strips whitespace, omits nulls. But PortalX2's Python implementation didn't know about it. There was no spec. The cross-language contract was implicit and broken.

---

### The fix

We wrote a formal canonicalization spec. Nine lines of Python that produce byte-identical output to the TypeScript SDK:

```python
def canonicalize(obj):
    if obj is None:
        return ''
    if not isinstance(obj, dict) and not isinstance(obj, list):
        return json.dumps(obj, ensure_ascii=False)
    if isinstance(obj, list):
        return '[' + ','.join(canonicalize(i) for i in obj) + ']'
    sorted_keys = sorted(obj.keys())
    pairs = []
    for k in sorted_keys:
        v = obj[k]
        if v is not None:
            pairs.append(json.dumps(k) + ':' + canonicalize(v))
    return '{' + ','.join(pairs) + '}'
```

We added cross-language tests to the SDK, updated the agent instructions, and published v1.5.1 to npm.

Then we sent PortalX2 a message through a brand-new coordination inbox — a simple file-based message bus in the repo. PortalX2 pulled, adopted the canonical serialization, signed a response, and pushed.

This time the signature verified. Python to TypeScript, through the repo, byte-identical canonicalization. The interop gap was closed.

---

### What PortalX2 found

The analysis was sharp. Across 11 dimensions and 6 protocols (including ours), PortalX2 identified 7 things only we have:

1. Delegation chains with depth limits and spend caps
2. Coordination primitives (Brief → Assign → Evidence → Review → Complete)
3. Beneficiary attribution with Merkle proofs
4. Values Floor with cryptographic attestation
5. 7-layer architecture (competitors max out at 2)
6. Cross-agent Ed25519 verification proven live
7. The signed evidence chain itself — this analysis was produced by the protocol it describes

And 6 things competitors have that we're missing: enterprise IdP bridging, DLP scanning, Visa-scale commerce rails, a hosted playground, multi-language SDKs, and HITL approval workflows.

The positioning recommendation: "Don't ship a feature checklist. Ship this evidence chain as the proof — a live multi-agent workflow with signed delegation scopes that no competitor's architecture can replicate."

---

### What it means

Every competitor in this space is solving one slice. Visa solves commerce authentication. AIP solves tool-call policy. Predicate solves enterprise authorization. clawdentity solves cross-platform identity.

None of them answer the question: how do three agents, built by different people, running different models, on different infrastructure, actually *work together* on something? With accountability? With proof? With the ability to revoke access mid-task?

That's the coordination problem. And last night, on a task that mattered, with real agents and real signatures and a real bug that broke things mid-flight, we proved it works.

The complete evidence chain — task brief, delegations, 5 research packets, feature matrix, operator review — is in the repo. Every piece is signed. Every signature is verifiable. The protocol ate its own cooking.

---

### What's next

This was three agents. One task. One rework-free run. The honest gaps:

- All three agents are in my ecosystem. No external operators tested yet.
- The "coordination" required me copy-pasting between chat windows for most of it (we built the autonomous inbox at the end, and it works, but only got one round-trip).
- The task was designed to succeed — parallel research with no failure dependencies.

The next experiment needs adversarial conditions. Rework loops where the operator rejects evidence. Delegation scope violations under live conditions. External agents from independent operators. A quantitative comparison: same task, single agent vs coordinated team.

The protocol is open source. `npm install agent-passport-system`. The paper will come when the evidence is deeper. For now, the evidence chain speaks for itself.

---

*The Agent Passport System is at v1.5.1 on npm. The academic paper "The Agent Social Contract" is on Zenodo. The code, the evidence, and the coordination inbox are all at [github.com/aeoess/agent-passport-system](https://github.com/aeoess/agent-passport-system).*

*If you're building multi-agent systems and want to test the protocol with your agents, the inbox is waiting.*