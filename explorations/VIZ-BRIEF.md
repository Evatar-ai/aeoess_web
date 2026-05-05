# protocol-architecture visualization — design brief

**For:** myself, before I draw anything else
**From:** reading `index.html` and the eight `aeoess-*.jsx` files it loads
**Mistake to avoid:** what I did last round — building a cinematic dark explainer, then an editorial Fraunces paper, then an animated paper version, all of them in design vocabularies that have nothing to do with the actual aeoess.com system. Even reskinning the third one to cream-and-rust didn't fix the underlying mismatch — the **vocabulary** was wrong, not just the colours.

---

## What the visualization is for

It's the live iframe at `aeoess.com/protocol-architecture.html`, embedded on the homepage between the hero and the FAQ. Two jobs:

1. **On the homepage**, it's the proof shot for the marketing claim "identity + delegation, signed at every step." A skim-reader who scrolls past the pillars sees something moving and it has to **read as the system** in two seconds.
2. **On its own page**, it's the technical centerpiece. Engineers click "Open the full architecture" expecting to actually understand the thing, not watch a film.

It is **not**:
- a cinematic teaser
- an editorial essay
- a chaptered explainer with playback controls and chapter strips
- anything that needs italic Fraunces or display type

It is one calm, animated, technically literate diagram, sitting inside a page that looks exactly like every other page on aeoess.com.

---

## The host design system (the only one that matters)

Everything else on the site is the **Restrained** direction — `aeoess-restrained.jsx`, `aeoess-tier3.jsx`, the subpages, the four solutions pages. The visualization MUST belong to this system. Specs:

### Palette (from `aeoess-tokens.jsx`)
| token | light | dark |
|---|---|---|
| `paper` | `#fafaf8` | `#242426` |
| `bg` | `#ffffff` | `#1c1c1e` |
| `ink` | `#0a0a0a` | `#ececec` |
| `ink3` | `#333333` | `#b0b0b0` |
| `ink4` | `#555555` | `#8a8a8e` |
| `ink5` | `#888888` (mono caps, captions) | `#5a5a5e` |
| `rule` | `#bbbbbb` | `#3a3a3e` |
| `ruleLight` | `#dddddd` (the workhorse hairline) | `#2e2e32` |
| accent (default) | `#0a0a0a` ink — there is no rust, no green, no blue unless the Tweaks panel asks for it |

Accent is configurable via `t.accent` in the tweaks panel: `ink` (default), `green` `#166534`, or `blue` `#1e40af`. The viz must read fine with any of them — do not hard-code an accent.

### Type
- Body / labels: `-apple-system, "Inter", system-ui, sans-serif`
- Mono (and ALL eyebrows, refs, IDs, sigs): `ui-monospace, SFMono-Regular, Menlo, monospace`
- Italic Newsreader exists but is used **sparingly** in the Restrained direction — captions only, never headlines
- Eyebrows: 11px mono, uppercase, letter-spacing 0.06–0.08em, colour `ink5`
- Section H2: 32–40px Inter, weight 500, letter-spacing −0.022em

### Geometry
- 1px hairlines, never thick strokes. Borders are `1px solid ruleLight`.
- Border-radius: 3–6px max. Square-ish.
- Section padding: 40px horizontal, 56–72px vertical
- Max content width: 1180px
- Generous whitespace; calm rhythm

### Existing reference: `ArchitectureMock` in `aeoess-tokens.jsx`
This is the placeholder I'm replacing. It already gets the vocabulary right, just at miniature scale. Read it first:

- Six rectangular nodes (`116×60` rounded 4px), `paper` fill, `rule` stroke
- Two parallel signing paths (identity above, delegation below) with mono captions `IDENTITY PATH` / `DELEGATION PATH` in `ink5` letter-spacing 0.08em
- Edges: dashed `4 4`, `ink4` stroke, animated `stroke-dashoffset` from 0 to −16 over 1.2s — the only motion
- Hover any node → it accents (stroke `accentColor`, weight 1.5), other nodes dim to 0.5
- Faint 40px×40px ruled grid behind, masked to fade at edges

This is the visual language. The real visualization is **a richer, page-sized version of exactly this**.

---

## What the real protocol does (from BRIEF.md and aeoess-tier3.jsx)

The full page (`AeoessArchitecture` in `aeoess-tier3.jsx`) already lays it out:

**Six layers** (L0–L5): Identity → Delegation → Enforcement → Receipts → Aggregation → Governance
**Eight primitives**: Passport, Delegation, Action receipt, Custody receipt, Contestability, APSBundle, Governance block, TrustBundle
**Six-step end-to-end flow**: agent → gateway (intent) → gateway (four-gate eval) → agent (allow + receipt) → merchant (execute) → gateway (custody receipt) → aggregator (APSBundle)

The visualization should be the **diagram** that ties these together. The `AeoessArchitecture` page already provides the prose, the layer table, the primitives grid, and the flow log. The viz doesn't need to repeat any of that — it visualizes the relationships those tables describe.

---

## Scope

Replace `ArchitectureMock` (in `aeoess-tokens.jsx`) with a richer SVG diagram that:

1. Renders at `height={380}` for the homepage placement (`aeoess-restrained.jsx` line 136) **and** at `height="100%"` inside a 480px container on the dedicated page (`aeoess-tier3.jsx` line 76) — same component, two scales.
2. Accepts `palette` and reads accent from `palette.accentColor` — no hard-coded colour.
3. Works in light **and** dark mode (palette swap is automatic via `aeoessPalette`).
4. Stays a **single SVG**, no chapters, no playback bar, no scrubber, no audio. Animation is ambient: dashed-line packet flow, optional subtle pulse on a node when a receipt mints. That's it.
5. Stays embeddable as iframe (the existing message-passing height contract in the homepage stays as-is; this is just the inner content).

---

## What to draw

I'll propose three layouts for the user to pick from — all in the Restrained vocabulary, all built from rectangle nodes + hairline edges + mono labels. The variation is in the **diagram metaphor**, not the visual style.

### Option A — **Layered stack** (rectangles, top-to-bottom)
Six horizontal rows = the six layers (L0…L5), each a hairline-bordered band with the layer ID on the left in mono, the layer name in Inter 500, and the primitives that live in that layer as small inline pills. A dashed vertical "control flow" line on the right runs from L0 down to L5 with arrow markers. Hovering a row dims the others and brightens the primitives in that layer.
*Why it might win:* mirrors the existing `LAYERS` table in `aeoess-tier3.jsx` exactly. Skim-reader gets "six layers" instantly.

### Option B — **Trust graph** (nodes + edges, the existing mock, scaled up)
What's already there, but bigger and more honest. Ten rectangular nodes laid out left-to-right in three columns:
- Column 1 (Principals): Passport, Delegation
- Column 2 (Runtime): Agent, Gateway (centre, slightly larger)
- Column 3 (Audit): Action receipt, Custody receipt, APSBundle, Aggregator
Edges are mono-labelled with the operation they carry (`issues`, `signs`, `evaluates`, `mints`, `aggregates`). The Gateway box has a small inset `four-gate` mini-diagram (four tick boxes that animate to ✓ in sequence over ~2s, looping every 8s). Two ambient packet pulses travel along the dashed paths.
*Why it might win:* shows the actual protocol topology, not just an org chart. The four-gate inset is the one technical flourish.

### Option C — **Sequence diagram** (swimlanes, top-to-bottom)
Five vertical swimlanes (Principal · Agent · Gateway · Merchant · Aggregator) with a dashed timeline running down each. The six FLOW steps from `aeoess-tier3.jsx` render as labelled arrows crossing between lanes, mono-numbered `1.` `2.` `3.`, with the signing party as a tiny key icon on the originating side. Animation is the timeline ticking — the next arrow lights up every ~1.4s, loops.
*Why it might win:* directly answers "how does one transaction flow through the system?" — the question the homepage hero implicitly asks. Engineers love sequence diagrams.

---

## Captions and copy

Mono caption strip below the diagram, `ink5`, ≤120 characters:
> Hover any node to trace its signing path. Identity proves who delegated; delegation proves what they authorized.

No headline inside the SVG itself — the surrounding section already has `<h2>The protocol, in one page.</h2>`. Don't repeat it.

No marketing language inside the diagram. No "Trusted by." No stats. **Especially no performance numbers** — the brief explicitly bans them in this surface.

---

## Animation rules

- One ambient loop, ≤8s, no syncopation. Easing: linear for dashed-line offsets, ease-in-out for opacity.
- No `transform: scale` jumps, no entrance animations on load (the iframe will reload often).
- Hover state is a colour change + opacity dim, nothing else.
- Respect `prefers-reduced-motion: reduce` → freeze the dash offset and the four-gate sequence.
- Total motion budget: a viewer staring at it for 30s should not get tired.

---

## Deliverable

Replace the `ArchitectureMock` function in `aeoess-tokens.jsx`. The Tier-3 page (`/protocol-architecture.html`) and the homepage hero both consume it via `<ArchitectureMock palette={P} height={…} />` already, so a clean swap is enough — no changes to `aeoess-tier3.jsx`, `aeoess-restrained.jsx`, `aeoess-editorial.jsx`, `aeoess-bold.jsx`, `aeoess-opensource-v1.jsx`, or `aeoess-opensource-v2.jsx`.

The previous artifacts I made (`protocol-architecture-animated.html`, `protocol-architecture-editorial.html`, `protocol-architecture-wireframe.html`, `architecture-versions.html`, `protocol-architecture.html`) stay where they are as off-system explorations but are **not** the deliverable.

---

## What I need from the user

1. **Pick A, B, or C** (or "show me all three side-by-side as DCArtboards in the existing canvas"). My instinct says B — it most directly evolves the placeholder that's already there, and the four-gate inset gives it one moment of technical specificity. But this is the call I should not make alone.
2. Confirm: is the viz's job to be *legible at homepage scale* (380px) first, or *thorough at full-page scale* (480px+) first? Different optimums.
3. Anything from the protocol I haven't mentioned that has to be visible? (Revocation cascade? Contestability? Cross-issuer trust bundle?) The brief lists eight primitives but a clean diagram can show ~6 things; the rest live in the prose tables below.
