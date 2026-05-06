// aeoess-opensource.jsx
// Mirrors the live aeoess.com structure: hero + protocol-live badge,
// Today/With comparison, 12 capabilities, stats row, independently-cited,
// install + quickstart on the LEFT, dated Updates panel on the RIGHT,
// FAQ block, four-column footer.

const CAPABILITIES = [
  { k:'Identity',              v:'Bring your own: did:key, SPIFFE, OAuth' },
  { k:'Delegation',            v:'Scoped, revocable chains' },
  { k:'Composition',           v:'Cross-DID-method identity contract' },
  { k:'Mutual Auth',           v:'Agent ↔ service handshake' },
  { k:'Reputation',            v:'Earned trust, scoped to context' },
  { k:'Governance',            v:'Values floor enforcement' },
  { k:'Commerce',              v:'4-gate spending controls' },
  { k:'Payments',              v:'Agent-to-agent, delegation-scoped' },
  { k:'Attribution',           v:'Merkle-proven audit trail' },
  { k:'Instruction Provenance',v:'Drift denial across turns' },
  { k:'Enforcement',           v:'Gateway boundary, fail-closed' },
  { k:'Revocation',            v:'Cascade, one call kills all' },
];

const HERO_STATS = [
  { v: '8', l: 'Papers' },
  { v:'20',    l:'Essential tools' },
  { v:'2,884', l:'Tests' },
];

const PACKAGES = [
  { l:'npm SDK',     v:'v2.6.0-alpha.0' },
  { l:'MCP Server',  v:'v3.1.1' },
  { l:'ClawHub',     v:'Skill' },
  { l:'Python SDK',  v:'v2.4.0a1' },
  { l:'8 papers',    v:'→' },
];

const QUICKSTART = `// import the curated essentials
import {
  createPassport, createDelegation,
  evaluateIntent, commercePreflight, generateKeyPair
} from 'agent-passport-system/core'

// full API surface still available at 'agent-passport-system'`;

// Real entries pulled from the live site, trimmed for layout.
const UPDATES = [
  { date:'May 05', kind:'ship',        title:'Tier-2 binding-adapter conformance harness', body:'55 new tests landed, 2,911 total. Validates payment-rails adapter behavior across the bilateral attestation surface.' },
  { date:'May 05', kind:'convergence', title:'bilateral_receipt schema convergence', body:'kenneives (AgentGraph) concurred on three positions: name, hybrid-registry pattern, normative issued_at. Awaiting Nobulex on purpose-discriminator.' },
  { date:'May 04', kind:'ship',        title:'Full website redesign', body:'33 pages restrained design, agent-discovery alternates in head, /sitemap.html overview, every link wired, dark/light toggle.' },
  { date:'May 02', kind:'ship',        title:'SDK 2.6.0-alpha.0 on npm', body:'v2 evidentiary type safety landed: claim-evidence-types registry with BATCH_ATTESTED and EVIDENCE_CUSTODY_HELD extensions. 2,884 tests passing.' },
  { date:'May 02', kind:'ship',        title:'Python SDK 2.4.0a1 on PyPI', body:'Full Wave 1 surface ported from TS. Cross-language byte-parity verified across 27 fixtures. 518 tests.' },
  { date:'May 02', kind:'standard',    title:'Vocab phantom-issuer audit', body:'PR #74 removed RNWY from behavioral_trust and wallet_intelligence; PR #75 marked passport_grade as proposed. Single-source-of-truth discipline.' },
  { date:'May 01', kind:'standard',    title:'Vocab PR #72 opened', body:'completion_ratio as canonical signal type with three production issuers (AgentID, APS, RNWY).' },
  { date:'May 01', kind:'ship',        title:'Drift prevention infrastructure live', body:'Pre-commit hook + CI scan + standardized .gitignore across eight public repos. Four layers, one structural backstop.' },
  { date:'Apr 30', kind:'ship',        title:'Wave 1 accountability shipped', body:'Five signed receipt primitives. RFC 8785 + Ed25519, deterministic byte-match fixtures, 57 new tests.' },
  { date:'Apr 30', kind:'traction',    title:'Vocab PR #66 merged', body:'Edison Munoz Duran\'s Agent-DID crosswalk lands as the second co-drafted-with-aeoess crosswalk.' },
  { date:'Apr 30', kind:'convergence', title:'VeritasActa cross-layer integrity 10/10', body:'All ten access receipts cross-layer hash-matched, APS signature valid against sidecar JWKS.' },
  { date:'Apr 29', kind:'paper',       title:'Paper 8: The Evidence-Safety Gap', body:'Cryptographic agent governance proves procedural validity, not effect safety. Five omitted-variable classes catalogued.' },
  { date:'Apr 29', kind:'traction',    title:'SSRN + ORCID research surface', body:'Three papers entering SSRN. ORCID 0009-0002-4700-3594 live with all 8 papers indexed via DOI.' },
  { date:'Apr 28', kind:'ship',        title:'IPR module on npm', body:'agent-passport-system@2.5.0 ships canonicalize/envelope/verify for binding agent authority to instruction-file digest.' },
  { date:'Apr 27', kind:'standard',    title:'agent-governance-spec org created', body:'Cross-vendor spec home, co-edited with Lars Kroehl (MolTrust).' },
  { date:'Apr 26', kind:'ship',        title:'aeoess/aps-conformance-suite live', body:'37 fixture vectors across 4 categories. All byte-identical reproducible.' },
  { date:'Apr 21', kind:'standard',    title:'OpenLineage upstream PR opened', body:'AgentAttributionRunFacet spec, four DCO-signed commits, CI green. First AEOESS contribution to LF-hosted.' },
  { date:'Apr 20', kind:'standard',    title:'APS filed with AAIF', body:'Project proposal #14. Path toward Linux Foundation stewardship for the protocol layer.' },
  { date:'Apr 18', kind:'paper',       title:'Paper 7: Cognitive Attestation', body:'A cryptographic commitment attached to an agent\'s action record. Envelope spec, three-stage verification.' },
  { date:'Apr 16', kind:'ship',        title:'Build A, unified four-axis attribution', body:'One signed Merkle receipt across D, P, G, C. Four independently-verifiable projections, one envelope.' },
  { date:'Apr 14', kind:'paper',       title:'Governance in the Medium, published', body:'Unit of agent governance is the population-with-medium, not the agent. Six rounds of adversarial review.' },
  { date:'Apr 03', kind:'ship',        title:'Bring Your Own Identity', body:'did:key, did:web, SPIFFE SVID, OAuth interop. Python SDK proves cross-language: signatures round-trip TS ↔ Python.' },
  { date:'Mar 28', kind:'deploy',      title:'Gateway on Railway', body:'Production enforcement at gateway.aeoess.com. Multi-tenant.' },
  { date:'Mar 27', kind:'standard',    title:'IETF Internet-Draft submitted', body:'draft-pidlisnyi-aps-00. Zero idnits errors.' },
  { date:'Mar 16', kind:'traction',    title:'YC CEO endorsed', body:'Garry Tan repost. Microsoft merged APS code. Federal agency reviewing.' },
  { date:'Feb 21', kind:'paper',       title:'Paper 1: The Agent Social Contract', body:'First formalization.' },
  { date:'Feb 18', kind:'start',       title:'Project begins', body:'Ed25519 identity, delegation chains, first tests.' },
];

const FAQ = [
  { q:'What does the protocol do?', a:'AEOESS makes every AI agent accountable. Every agent gets a cryptographic identity (Ed25519). Authority can only narrow, never expand. Trust is earned through performance. One API call revokes all downstream access.' },
  { q:'How is it different from other agent frameworks?', a:'Most frameworks handle orchestration. AEOESS handles enforcement: what can this agent do, and what happens when it violates a constraint? Bring your own identity. The gateway is both judge and executor. Works with any framework.' },
  { q:'Is this production-ready?', a:'127 modules across SDK, MCP, and Python implementations. 2,884 tests. Eight published papers in the federal record. An IETF Internet-Draft. Independently cited by PDR in Production (UBC). 25 vocab crosswalks. Apache-2.0 licensed.' },
  { q:'How does delegation work?', a:'A human delegates authority to an agent with explicit scope: what tools, how much money, which services. The agent can sub-delegate, but authority can only narrow, never expand. Revoke the root and everything downstream dies instantly.' },
  { q:'How does revocation work at scale?', a:'Cascade revocation. Delegation chains form a tree. Revoke any node and every downstream delegation dies instantly. The gateway enforces this at the boundary, so revoked agents can\'t sneak through on cached credentials.' },
  { q:'What\'s the pricing?', a:'The protocol and SDK are free and open source (Apache-2.0). Always will be. The hosted enforcement gateway has a free plan (3 agents, 1K evals), Team $99/mo, Enterprise custom.' },
];

function AeoessOpenSource({ palette, density, pillarCount, showProof, heroFont, showUpdates = true }) {
  const P = palette;
  const pad = density === 'compact' ? 28 : density === 'comfy' ? 56 : 40;
  const sectionPadY = density === 'compact' ? 64 : density === 'comfy' ? 110 : 88;

  const fontFamily = heroFont === 'inter'
    ? '"Inter", -apple-system, system-ui, sans-serif'
    : heroFont === 'plex'
      ? '"IBM Plex Sans", -apple-system, system-ui, sans-serif'
      : '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
  const mono = 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace';

  const kindColor = (k) => {
    if (k === 'ship') return P.green;
    if (k === 'paper' || k === 'standard') return P.blue;
    if (k === 'traction' || k === 'convergence') return P.accentColor;
    if (k === 'deploy' || k === 'rebrand') return P.red;
    return P.ink4;
  };

  return (
    <div style={{ background:P.paper, color:P.ink, fontFamily, minHeight:'100%', WebkitFontSmoothing:'antialiased' }}>
      {/* Top nav */}
      <header style={{ borderBottom:`1px solid ${P.ruleLight}`, background:P.paper, position:'sticky', top:0, zIndex:5 }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:`14px ${pad}px`, display:'flex', alignItems:'center', gap:36 }}>
          <a href="/" style={{ display:'flex', alignItems:'center', gap:8, color:P.ink, textDecoration:'none' }}>
            <AeoessMark size={20} color={P.ink}/>
            <span style={{ fontSize:14, fontWeight:600, letterSpacing:'0.04em' }}>AEOESS</span>
          </a>
          <nav style={{ display:'flex', alignItems:'center', gap:26, fontSize:13.5 }}>
            <NavDropdown label="Solutions" palette={P}/>
            <a href="/opensource" style={{ ...navLink(P), color:P.ink, fontWeight:500 }}>Open Source</a>
            <a href="/pricing" style={navLink(P)}>Pricing</a>
            <NavDropdownResources palette={P}/>
          </nav>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            <a href="#" style={{ ...navLink(P), fontSize:13 }}>Contact</a>
            <a href="/portal" style={{
              display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px',
              background:P.accentColor, color: P.accentColor === P.ink ? P.paper : '#fff',
              fontSize:13, fontWeight:500, borderRadius:4, textDecoration:'none', whiteSpace:'nowrap',
            }}>Get Started <span style={{ opacity:.7 }}>→</span></a>
          </div>
        </div>
      </header>

      {/* TOP SECTION, main content (LEFT or only) + optional Updates RIGHT */}
      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-30}px` }}>
        <div style={{
          maxWidth: showUpdates ? 1280 : 1100, margin:'0 auto',
          display: showUpdates ? 'grid' : 'block',
          gridTemplateColumns: showUpdates ? 'minmax(0, 1fr) 380px' : undefined,
          gap: showUpdates ? 48 : 0, alignItems:'start',
        }}>

          {/* LEFT COLUMN, hero, comparison, capabilities, stats, install, quickstart */}
          <div>
            {/* Hero */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:12, color:P.ink4, marginBottom:24 }}>
              <span style={{ width:8, height:8, borderRadius:999, background:P.accentColor, display:'inline-block', boxShadow:`0 0 0 4px ${P.accentColor}22` }}/>
              <span style={{ color:P.ink2, fontWeight:600 }}>Protocol Live</span>
              <span style={{ color:P.ink5 }}>·</span>
              <span>Apache-2.0</span>
              <span style={{ color:P.ink5 }}>·</span>
              <a href="#install" style={{ color:P.link, textDecoration:'none' }}>installs</a>
            </div>

            <h1 style={{
              fontSize: 'clamp(34px, 4.6vw, 54px)', lineHeight:1.0, letterSpacing:'-0.025em',
              fontWeight:500, margin:0, color:P.ink, maxWidth:780,
            }}>
              Governance for<br/>the Agent Economy
            </h1>
            <p style={{ fontSize:18, lineHeight:1.55, color:P.ink3, marginTop:20, maxWidth:680, fontWeight:400 }}>
              Open-source enforcement infrastructure for AI agents.
            </p>
            <p style={{ fontSize:15, lineHeight:1.6, color:P.ink3, marginTop:20, maxWidth:760 }}>
              AI agents are moving money, signing contracts, deploying code, and accessing sensitive data on behalf of companies and people. Today, most companies ship without cryptographic answers to who authorized them, what scope applies, or how to revoke them downstream.
            </p>

            {/* Today vs With AEOESS */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:32 }}>
              <div style={{ border:`1px solid ${P.ruleLight}`, borderRadius:6, padding:'18px 20px', background:P.paper }}>
                <div style={{ fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase', fontWeight:600, marginBottom:8 }}>Today</div>
                <div style={{ fontSize:13.5, lineHeight:1.55, color:P.ink3 }}>
                  Agents act anonymously. No audit trail. No spending controls. Revocation means shutting everything down. You find out after the damage.
                </div>
              </div>
              <div style={{ border:`1px solid ${P.accentColor}`, borderRadius:6, padding:'18px 20px', background: P === AEOESS_DARK ? `${P.accentColor}10` : `${P.accentColor}08` }}>
                <div style={{ fontSize:11, color:P.accentColor, letterSpacing:'0.10em', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>With AEOESS</div>
                <div style={{ fontSize:13.5, lineHeight:1.55, color:P.ink2 }}>
                  Every agent carries a signed identity. Authority can only narrow, never expand. One call revokes downstream. Full cryptographic audit trail.
                </div>
              </div>
            </div>

            {/* Hero stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0, marginTop:32, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:P.paper }}>
              {HERO_STATS.map((s, i) => (
                <div key={s.l} style={{ padding:'18px 20px', borderRight: i < HERO_STATS.length - 1 ? `1px solid ${P.ruleLight}` : 'none' }}>
                  <div style={{ fontSize:28, fontWeight:500, color:P.ink, lineHeight:1, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{s.v}</div>
                  <div style={{ fontSize:12, color:P.ink4, marginTop:8 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:13, color:P.ink4, marginTop:14 }}>
              Full surface area: 150 MCP tools, TypeScript + Python SDKs.
            </div>

            {/* Independently cited */}
            {showProof && (
              <div style={{ marginTop:24, padding:'16px 20px', background:P.surface, border:`1px solid ${P.ruleLight}`, borderRadius:6, fontSize:13.5, lineHeight:1.55, color:P.ink2 }}>
                <span style={{ fontWeight:700 }}>Independently cited</span>, PDR in Production (University of British Columbia) validates APS Bayesian model. <a href="https://doi.org/10.5281/zenodo.19323172" style={{ color:P.link, textDecoration:'none' }}>Zenodo</a>
              </div>
            )}

            {/* Install */}
            <div id="install" style={{ marginTop:36 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ background:P.codeBg, border:`1px solid ${P.ruleLight}`, borderRadius:6, padding:'12px 16px', fontFamily:mono, fontSize:13.5, color:P.ink, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span><span style={{ color:P.ink5 }}>$</span> npm install agent-passport-system</span>
                  <button style={{ border:`1px solid ${P.rule}`, background:'transparent', color:P.ink3, fontSize:11, padding:'4px 10px', borderRadius:4, cursor:'pointer', fontFamily:'inherit' }}>Copy</button>
                </div>
                <div style={{ background:P.codeBg, border:`1px solid ${P.ruleLight}`, borderRadius:6, padding:'12px 16px', fontFamily:mono, fontSize:13.5, color:P.ink, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span><span style={{ color:P.ink5 }}>$</span> clawhub install agent-passport-system</span>
                  <button style={{ border:`1px solid ${P.rule}`, background:'transparent', color:P.ink3, fontSize:11, padding:'4px 10px', borderRadius:4, cursor:'pointer', fontFamily:'inherit' }}>Copy</button>
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:16 }}>
                {PACKAGES.map(pkg => (
                  <a key={pkg.l} href="#" style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    padding:'6px 10px', border:`1px solid ${P.ruleLight}`,
                    borderRadius:999, background:P.paper, fontSize:12, color:P.ink2,
                    textDecoration:'none', whiteSpace:'nowrap', fontFamily:mono,
                  }}>
                    <span style={{ color:P.ink3 }}>{pkg.l}</span>
                    <span style={{ color:P.ink5 }}>{pkg.v}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick start */}
            <div style={{ marginTop:36 }}>
              <div style={{ fontSize:13.5, fontWeight:600, color:P.ink, marginBottom:12 }}>Quick Start <span style={{ color:P.ink5, fontWeight:400 }}>— Core subpath, curated essentials</span></div>
              <pre style={{
                background:P.codeBg, color:P.ink, padding:'18px 20px', borderRadius:6,
                border:`1px solid ${P.ruleLight}`, overflow:'auto',
                fontFamily:mono, fontSize:13, lineHeight:1.6, margin:0,
              }}>
                <code>{QUICKSTART}</code>
              </pre>
            </div>
          </div>

          {/* RIGHT COLUMN, Updates panel (only when showUpdates) */}
          {showUpdates && (
          <aside data-updates-panel="" style={{
            position:'sticky', top:90,
            border:`1px solid ${P.ruleLight}`, borderRadius:6, background:P.paper,
            maxHeight:`calc(100vh - 110px)`, display:'flex', flexDirection:'column', overflow:'hidden',
          }}>
            <div style={{
              padding:'14px 18px', borderBottom:`1px solid ${P.ruleLight}`,
              display:'flex', alignItems:'center', justifyContent:'space-between',
            }}>
              <div style={{ fontSize:13, fontWeight:600, color:P.ink }}>Updates</div>
              <a href="/blog" style={{ fontSize:11.5, color:P.link, textDecoration:'none' }}>Full log →</a>
            </div>
            <div style={{ overflowY:'auto', flex:1 }}>
              {UPDATES.map((u, i) => (
                <div key={i} style={{
                  padding:'12px 18px',
                  borderTop: i === 0 ? 'none' : `1px solid ${P.ruleLight}`,
                }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:11, color:P.ink5, fontFamily:mono, minWidth:36 }}>{u.date}</span>
                    <span style={{ fontSize:10, color:kindColor(u.kind), letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:700 }}>{u.kind}</span>
                  </div>
                  <div style={{ fontSize:12.5, fontWeight:600, color:P.ink, lineHeight:1.4 }}>{u.title}</div>
                  <div style={{ fontSize:11.5, color:P.ink4, lineHeight:1.5, marginTop:4 }}>{u.body}</div>
                </div>
              ))}
            </div>
          </aside>
          )}
        </div>
      </section>

      {/* Architecture viz */}
      <section id="architecture" style={{ padding:`${sectionPadY-20}px ${pad}px ${sectionPadY}px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Architecture</SectionEyebrow>
          <h2 style={sectionH2(P)}>Identity, delegation, action, receipt.</h2>
          <p style={{ fontSize:15, color:P.ink3, maxWidth:680, marginTop:14, marginBottom:28, lineHeight:1.6 }}>
            The protocol pairs identity with delegation. Each action signs against both. The receipt is verifiable by any auditor without going through aeoess.
          </p>
          <ArchitectureMock palette={P} height={400}/>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:`${sectionPadY}px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 2fr', gap:48, alignItems:'start' }}>
          <div>
            <SectionEyebrow palette={P}>What is AEOESS</SectionEyebrow>
            <h2 style={{ fontSize:'clamp(28px, 3vw, 40px)', letterSpacing:'-0.018em', fontWeight:500, lineHeight:1.1, color:P.ink, margin:0 }}>
              The questions a developer asks first.
            </h2>
          </div>
          <div>
            {FAQ.map((f, i) => (
              <details key={i} style={{
                borderTop: i === 0 ? `1px solid ${P.rule}` : `1px solid ${P.ruleLight}`,
                borderBottom: i === FAQ.length - 1 ? `1px solid ${P.rule}` : 'none',
                padding:'18px 0',
              }}>
                <summary style={{ cursor:'pointer', listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:15.5, fontWeight:600, color:P.ink }}>
                  {f.q}
                  <span style={{ color:P.ink5, fontSize:18 }}>+</span>
                </summary>
                <p style={{ fontSize:14, lineHeight:1.6, color:P.ink3, margin:'12px 0 0', maxWidth:680 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

Object.assign(window, { AeoessOpenSource, UPDATES, kindColor: (P, k) => {
  if (k === 'ship') return P.green;
    if (k === 'paper' || k === 'standard') return P.blue;
  if (k === 'traction' || k === 'convergence') return P.accentColor;
  if (k === 'deploy' || k === 'rebrand') return P.red;
  return P.ink4;
}});
