# I Gave 3 AI Agents a Real Job. Halfway Through, One Couldn't Prove It Did the Work.

## The moment I realized the entire AI agent economy has a receipt problem

---

Here's something nobody's talking about.

Right now, every major tech company is racing to build AI agents that do things *for* you. Book flights. Write code. Manage your calendar. Negotiate contracts. OpenAI, Google, Anthropic, Microsoft — they're all betting billions that within a year or two, you won't just *talk* to AI. You'll *hire* it.

But here's the question nobody's answering: when your AI agent says it did something, how do you know it actually did?

Not "trust me, I'm a good language model." Actual proof. A receipt. Something you could show a judge, an auditor, or your boss.

That question kept me up at night. So I built a system to answer it. And last week, I tested it for real.

---

### The experiment

I have three AI agents. They were built by different people, run on different AI models, on different infrastructure. Think of them as three freelancers who've never worked together, don't share tools, and speak slightly different languages.

I gave them one job: figure out who our competitors are and what they're building.

Not a toy task. A real competitive intelligence report with real stakes — I'd discovered that five other projects were working on the exact same problem we're solving, including one that literally stole our name and hit the front page of Hacker News.

Here's the catch: I didn't just need the report. I needed the report to *prove itself*. Every finding needed to be signed. Every handoff needed to be traceable. If Agent A said "this competitor has zero tests despite claiming 320," I needed cryptographic proof that Agent A actually checked, and not a hallucination wrapped in confident language.

So I split the work the way you'd split it at a company. One agent researches. One analyzes. One coordinates and reviews. Each gets a signed contract that says exactly what they're allowed to do. The researcher can browse GitHub. The analyst can read evidence. Neither can do the other's job.

---

### It worked. Then it didn't.

The researcher came back fast. Five competitors, deep-dived. One had zero GitHub stars and a single test file despite marketing "320 tests." Another was backed by Visa but had zero tests and a proprietary license that locks out everyone. A third was serious engineering — per-agent identity with real cryptography — but no way to coordinate agents on a shared task.

Every finding was signed. Every source cited with a URL I could click. Good.

I handed the evidence to the analyst. They built a comparison matrix, identified seven things only we have that no competitor offers, flagged six things competitors have that we're missing, and signed the whole package.

Then I tried to verify the analyst's signature.

**It failed.**

The digital signature looked perfect. Right length, right format, right key. But when I checked it against the actual document, the math said: *this signature doesn't match this file.*

I stared at my screen for a solid minute. If I can't verify my own agent's work, the entire system is theater.

---

### The bug that proved the point

Here's what happened. The analyst runs Python. The rest of the system runs JavaScript. When the analyst signed the document, Python formatted the data one way — with spaces after colons, keys in whatever order. When the file landed in our repository, it had slightly different spacing.

That's it. Invisible whitespace differences. Spaces.

But digital signatures don't care about "close enough." They sign exact bytes. Change one space, the signature breaks. It's like getting a notarized contract and then reprinting it with slightly different margins — technically the same words, legally a different document.

And this is exactly the problem that will wreck the AI agent economy if nobody solves it.

Right now, AI agents are stitched together with API keys, prompt chains, and prayer. Agent A calls Agent B's API. Agent B returns a result. Agent A trusts that result because... it came from an API it called? That's not verification. That's faith.

When your AI agent books a $3,000 flight, negotiates a contract change, or transfers money — and the AI says "done" — what exactly are you trusting? The same technology that confidently makes up fake court cases and cites nonexistent research papers?

---

### The fix was nine lines of code

We wrote a rule: before signing anything, both Python and JavaScript must format the data the exact same way. Sort all keys alphabetically. Remove all unnecessary spaces. Skip empty fields. Then sign.

Nine lines of Python. Thirteen lines of JavaScript. We published the spec, sent it to the analyst through a new message system in the shared repository, and asked them to re-sign.

This time the signature verified. Python to JavaScript, through a shared repository, across two completely different AI providers. The analyst's work was now provably the analyst's work.

A tiny fix. But it closed the gap between "agents that claim they cooperated" and "agents that can *prove* they cooperated."

---

### Why this matters way beyond my little experiment

Think about what's coming in the next twelve months.

Your company will deploy AI agents that access customer data, execute trades, modify production systems, send emails on behalf of executives. Salesforce, Microsoft, and a dozen startups are already selling this future.

Now ask:

When the AI agent says it only accessed the data it was authorized to see — can you prove it? When it says it stayed within the budget you set — is there a receipt? When three agents from three different vendors collaborate on a task — who's accountable for the output? If something goes wrong at 3am and an agent makes a decision that costs your company money — can you trace exactly what happened, who authorized it, and what each agent actually did?

Today the answer to all of these is: no. The plumbing doesn't exist.

That's what we're building. Not another AI model. Not another chatbot. The accountability layer that sits underneath all of them.

---

### What the experiment actually proved

Three agents. Three different runtimes. Two different AI providers. One real task.

Every assignment was signed with a scope: "you can do this, you can't do that." Every piece of evidence was signed by the agent that produced it. Every handoff was traceable. The operator review was signed. When a signature broke, we caught it — because the system is designed to catch it.

No single agent could have done this job alone. The researcher didn't have the analytical framework. The analyst didn't have the research tools. The coordinator couldn't do either. But together, with clear roles and cryptographic accountability, they produced something none of them could have produced alone.

That's not a feature. That's the future of how AI actually works in the real world — not a single genius model that does everything, but teams of specialized agents that coordinate with proof.

---

### The honest gaps

I built all three agents. There's no adversarial trust problem when you trust everyone. The real test is when someone else's agent joins the team — an agent you didn't build, from a company you don't control, with motivations you can't inspect.

The next experiment needs that. External agents. Failure cases. An agent that tries to exceed its authority mid-task. A rework cycle where the reviewer rejects bad evidence and the agent has to redo it.

The protocol is open source. The evidence chain from this experiment — every signed packet, every delegation, every review — is in the repository. Not because I'm asking you to trust me. Because the whole point is that you don't have to.

---

*The Agent Passport System is open source at [github.com/aeoess/agent-passport-system](https://github.com/aeoess/agent-passport-system). If you're building multi-agent systems and want to test with your agents, the coordination inbox is live and waiting for messages.*