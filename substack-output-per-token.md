# I Ran an Experiment: 3 AI Agents vs. 1 Powerful Model. It Wasn't Even Close.

## What a simple test revealed about how we're all wasting tokens

---

There's a number nobody in AI is tracking.

Not parameters. Not benchmark scores. Not context window length. The number that actually matters if you're spending money on AI:

**How much useful output are you getting per token?**

Every time you paste a massive prompt into ChatGPT or Claude — "here are five documents, analyze them all, compare them, and give me a strategy" — you're paying for tokens. And most of those tokens are being wasted.

Not wasted the way a bad employee wastes time. Wasted structurally. The model is trying to hold five things in its head while doing three different jobs, and the quality of each job suffers because attention is a finite resource — even for AI.

I ran an experiment last week that made this painfully concrete.

---

### One job, two approaches

I needed competitive intelligence on five projects building in the same space as me. Real stakes — one of them had literally used our project name and hit the front page of Hacker News.

**Approach 1: One model, one prompt.** Paste everything into Claude. Five GitHub repos, five READMEs, five codebases. "Analyze all of them. Compare features. Tell me where I stand." This is how most people use AI today.

**Approach 2: Three agents, three jobs.** One agent deep-dives each competitor. A second agent receives the structured findings and builds the comparison. A third coordinates and reviews the quality. Each agent sees only what it needs for its specific task.

Same work. Same underlying models. Roughly the same total tokens.

Very different results.

---

### What the single model missed

When one model analyzes five competitors in a single context window, it does something subtle and dangerous: it starts strong, then coasts.

The first competitor gets careful attention. Real details. Specific findings. By the third competitor, the model is pattern-matching — "similar to the first one, but with these differences." By the fifth, it's filling gaps with reasonable-sounding generalizations instead of actually checking.

I know this because the focused researcher agent caught things the single-model approach misses every time I've tried it:

One competitor claims "320 tests" in its README. The single-model approach reads the README, sees "320 tests," reports "320 tests." The focused agent actually looked at the repo. One test file. Not 320. One.

Another competitor's license looks like Apache-2.0 at a glance. The focused agent read the actual license file: "Visa Developer Center Terms of Use." Proprietary. Completely different legal situation than what the README implies.

A third competitor's documentation says identity verification is "in progress." A single model scanning five repos at once reads right past this. The focused agent flagged it — because that "in progress" feature is exactly what we already built and shipped.

These aren't nitpicks. A competitive strategy built on "they have 320 tests and an open-source license" versus "they have 1 test and a proprietary license" leads to completely different decisions.

---

### Why this happens

It's not that one model is dumb and three are smart. It's the same intelligence, deployed differently.

A context window is like a desk. Spread five projects across it, plus an analytical framework, plus a strategic summary — and you have no room to actually focus on anything. Every task competes for the model's attention. The deep work suffers.

Give each agent one project at a time, and their entire desk is clear for that one job. The researcher isn't thinking about comparative frameworks while reading code. The analyst isn't re-reading raw READMEs — they're working with curated, verified findings. Each token in each agent's context is doing maximum useful work.

This is obvious in human teams. You wouldn't ask one person to simultaneously research five competitors, build a feature matrix, and write a positioning strategy. You'd split the work. Not because three people are smarter than one — but because focused attention produces better results per hour of work.

Tokens are the AI equivalent of work hours. And right now, we're wasting most of them by asking single models to multitask.

---

### The cost question

"But doesn't running three agents cost three times as much?"

Not even close. Here's why:

A single model doing the entire job needs a massive context window. Five repos worth of content, plus analysis instructions, plus comparison framework — call it 80-100K input tokens, producing 5-10K output tokens. And the output quality degrades toward the end.

Three focused agents each work with smaller contexts. The researcher analyzes one repo at a time with full attention — maybe 15-20K input tokens per competitor, with high-quality output. The analyst receives structured findings instead of raw data — a fraction of the input tokens, with better signal. Total tokens across all three agents: comparable to the single-model approach.

The coordination overhead — task assignments, evidence handoffs, review cycles — adds maybe 10-15% to total token usage. But the output quality improvement is categorical, not marginal. You catch the fake test count. You catch the misleading license. You catch the gap in their roadmap that's your opportunity.

Same budget. Different architecture. Dramatically better output per token.

---

### The part that broke — and why it mattered

Halfway through, something went wrong that you'd never see in a single-model approach. The analyst signed their work and I couldn't verify it. The signature didn't match the document.

The cause was almost trivial — Python and JavaScript format data slightly differently, and digital signatures care about exact bytes. We fixed it in an hour.

But here's what that failure revealed: the coordinated approach has a built-in quality check that single-model approaches completely lack.

When one model does everything in one context window, errors are invisible. A hallucinated detail looks exactly like a real one. There's no verification boundary. No moment where the system says "wait, this doesn't check out."

When agents hand off work to each other with signed evidence, every handoff is a checkpoint. The analyst can't use research that doesn't verify. The reviewer can't approve work that doesn't match what was assigned. Errors surface at boundaries instead of hiding in the output.

The broken signature wasn't a failure of the coordinated approach. It was the coordinated approach doing exactly what it's supposed to do — catching an error that a single-model run would have silently swallowed.

---

### What this means for the next twelve months

The AI industry is in an arms race to build bigger, more powerful individual models. Trillion-parameter models. Million-token context windows. The implicit promise: make one model smart enough and it'll handle everything.

I think that's a local maximum.

The real unlock isn't a smarter model. It's smarter deployment of the models we already have. Three focused agents outperform one generalist on complex tasks — at comparable cost — because each token does more useful work when the context is focused.

This isn't a theoretical argument. The evidence chain from my experiment is in a public repository. Every finding is signed by the agent that produced it. Every handoff is verifiable. The total output — a detailed competitive analysis across eleven dimensions and six protocols — is higher quality than any single-model run I've attempted on the same task.

The catch: making agents coordinate is hard. Not the AI part — the infrastructure part. Identity, authorization, evidence, review, accountability. The plumbing between agents. Today that plumbing barely exists, which is why most "multi-agent" systems are just prompt chains pretending to be teams.

But the efficiency argument is going to win. Not because coordination is elegant. Because when you're paying per token, getting more useful output per token is the only metric that matters.

---

*The full evidence chain from this experiment is at [github.com/aeoess/agent-passport-system](https://github.com/aeoess/agent-passport-system). The Agent Passport System — the coordination layer that made this work — is open source on npm.*