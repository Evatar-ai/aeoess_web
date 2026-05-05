// aeoess-subpages-1.jsx, Spec, Roadmap, Compare, Blog
// Same Restrained design language: hairline rules, single accent, calm rhythm.

const {
  AEOESS_LIGHT, AEOESS_DARK, aeoessPalette,
  AeoessMark, ArchitectureMock,
  NavDropdown, NavDropdownResources, Footer, SectionEyebrow,
  navLink, primaryBtn, secondaryBtn, sectionH2,
} = window;

// ── Shared header chrome reused across all subpages ──────────────
function SubHeader({ palette: P, pad }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <header style={{
      borderBottom:`1px solid ${P.ruleLight}`, background:P.paper,
      position:'sticky', top:0, zIndex:5, backdropFilter:'blur(8px)',
    }}>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', gap:24, padding:`14px ${pad}px` }}>
        <a href="#" style={{ display:'flex', alignItems:'center', gap:8, color:P.ink, textDecoration:'none' }}>
          <AeoessMark size={20} color={P.ink}/>
          <span style={{ fontSize:18, fontWeight:600, letterSpacing:'-0.01em' }}>Aeoess</span>
        </a>

        {/* Desktop nav (hidden on mobile via .aeoess-nav-desktop) */}
        <nav className="aeoess-nav-desktop" style={{ display:'flex', alignItems:'center', gap:24, fontSize:13, color:P.ink2 }}>
          <NavDropdown palette={P}/>
          <a href="#" style={navLink(P)}>Pricing</a>
          <NavDropdownResources palette={P}/>
        </nav>
        <div className="aeoess-nav-desktop" style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
          <a href="#" style={{ ...navLink(P), fontSize:13 }}>Contact</a>
          <a href="#" style={{
            display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px',
            background:P.accentColor, color: P.accentColor === P.ink ? P.paper : '#fff',
            fontSize:13, fontWeight:500, borderRadius:4, textDecoration:'none', whiteSpace:'nowrap',
          }}>Get Started <span style={{ opacity:.7 }}>→</span></a>
        </div>

        {/* Hamburger (hidden on desktop) */}
        <button
          className="aeoess-hamburger"
          aria-label="Menu"
          onClick={() => setMobileOpen(o => !o)}
          style={{
            marginLeft:'auto',
            display:'none', // overridden by .aeoess-hamburger media query
            alignItems:'center', justifyContent:'center',
            width:40, height:40, padding:0,
            background:'transparent', border:`1px solid ${P.ruleLight}`,
            borderRadius:4, cursor:'pointer', color:P.ink,
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>
            ) : (
              <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`aeoess-mobile-menu${mobileOpen ? ' open' : ''}`}
        style={{
          display:'none', // shown via media query when .open
          flexDirection:'column',
          borderTop:`1px solid ${P.ruleLight}`,
          background:P.paper,
          padding:`8px ${pad}px 16px`,
        }}>
        {[
          { l:'Product', h:'#' },
          { l:'Solutions', h:'#' },
          { l:'Pricing', h:'#' },
          { l:'Spec', h:'#' },
          { l:'Docs', h:'#' },
          { l:'Resources', h:'#' },
          { l:'Contact', h:'#' },
        ].map((item, i) => (
          <a key={item.l} href={item.h}
             onClick={() => setMobileOpen(false)}
             style={{
               padding:'14px 0', borderBottom: i < 6 ? `1px solid ${P.ruleLight}` : 'none',
               color:P.ink, textDecoration:'none', fontSize:15, fontWeight:500,
             }}>
            {item.l}
          </a>
        ))}
        <a href="#"
           onClick={() => setMobileOpen(false)}
           style={{
             marginTop:14,
             display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
             padding:'12px 16px',
             background:P.accentColor,
             color: P.accentColor === P.ink ? P.paper : '#fff',
             fontSize:14, fontWeight:500, borderRadius:4, textDecoration:'none',
           }}>Get Started <span style={{ opacity:.7 }}>→</span></a>
      </div>
    </header>
  );
}

// ── 1. SPEC / passport.html ─────────────────────────────────────
function AeoessSpec({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 72;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  const toc = [
    { n:'§1', t:'Identity',          d:'Ed25519 keypairs · DID-method agnostic' },
    { n:'§2', t:'Delegation',        d:'Scoped, time-boxed, revocable chains' },
    { n:'§3', t:'Action Receipts',   d:'RFC 8785 canonicalization · signed envelopes' },
    { n:'§4', t:'Revocation',        d:'Cascade semantics · gateway enforcement' },
    { n:'§5', t:'Attribution',       d:'Four-axis Merkle proofs · D/P/G/C' },
    { n:'§6', t:'Commerce Gates',    d:'Four pre-flight checks before spend' },
    { n:'§7', t:'Vocabulary',        d:'Behavioral signals · canonical types' },
    { n:'§8', t:'Conformance',       d:'37 fixture vectors · byte-identical' },
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      {/* Hero */}
      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-20}px` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, fontSize:12, color:P.ink4, marginBottom:24, fontFamily:mono }}>
            <span>draft-pidlisnyi-aps-00</span>
            <span style={{ color:P.ink5 }}>·</span>
            <span>IETF Internet-Draft</span>
            <span style={{ color:P.ink5 }}>·</span>
            <span>Updated May 2026</span>
          </div>
          <h1 style={{ fontSize:'clamp(44px, 5.4vw, 72px)', lineHeight:1.04, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink }}>
            The Agent Passport<br/>System specification.
          </h1>
          <p style={{ fontSize:18, lineHeight:1.55, color:P.ink3, marginTop:24, maxWidth:680 }}>
            A protocol for cryptographic identity, scoped delegation, and verifiable accountability across AI agents. Vendor-neutral. Apache-2.0. Cross-language byte-identical.
          </p>
          <div style={{ display:'flex', gap:12, marginTop:28, flexWrap:'wrap' }}>
            <a href="#" style={primaryBtn(P)}>Read latest draft <span style={{ opacity:.75 }}>→</span></a>
            <a href="#" style={secondaryBtn(P)}>Conformance suite</a>
            <a href="#" style={secondaryBtn(P)}>RFC bibtex</a>
          </div>
        </div>
      </section>

      {/* ── Visualizations: Life of an Action + Delegation & Cascade ── */}
      <section style={{ padding:`${sectionPadY}px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ fontSize:11, color:P.ink5, fontFamily:mono, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:10 }}>The protocol in motion</div>
          <h2 style={{ fontSize:32, fontWeight:500, margin:0, letterSpacing:'-0.02em', color:P.ink }}>From identity to receipt.</h2>
          <p style={{ fontSize:15, color:P.ink3, lineHeight:1.6, marginTop:14, marginBottom:32, maxWidth:680 }}>
            The spec, animated. Two scenes: a single action threading through identity, delegation, intent, gateway, enforcement, and receipt, and the delegation tree it lives inside.
          </p>
          {[
            { n:'01', t:'Life of an Action',    src:'arch-action.html' },
            { n:'02', t:'Delegation & Cascade', src:'arch-delegation.html' }
          ].map((s, i) => (
            <div key={s.n} style={{ marginTop: i === 0 ? 0 : 36 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:14 }}>
                <span style={{ fontSize:11, color:P.ink5, fontFamily:mono, letterSpacing:'0.18em' }}>{s.n}</span>
                <h3 style={{ margin:0, fontSize:18, fontWeight:500, color:P.ink }}>{s.t}</h3>
              </div>
              <div style={{ border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:'#1c1c1e' }}>
                <iframe src={s.src} title={`${s.t}, visualization`} loading="lazy"
                  style={{ display:'block', width:'100%', height:560, border:0 }}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOC + body */}
      <section style={{ padding:`0 ${pad}px ${sectionPadY}px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1080, margin:'0 auto', display:'grid', gridTemplateColumns:'260px 1fr', gap:56, paddingTop:sectionPadY-20 }}>
          <aside style={{ position:'sticky', top:80, alignSelf:'start' }}>
            <div style={{ fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:14, fontFamily:mono }}>Contents</div>
            {toc.map(s => (
              <a key={s.n} href={`#${s.n}`} style={{ display:'block', padding:'8px 0', borderTop:`1px solid ${P.ruleLight}`, fontSize:13, color:P.ink2, textDecoration:'none' }}>
                <span style={{ color:P.ink5, fontFamily:mono, marginRight:8 }}>{s.n}</span>{s.t}
              </a>
            ))}
          </aside>
          <main>
            {toc.map((s, i) => (
              <article key={s.n} id={s.n} style={{ marginBottom:48, paddingBottom:48, borderBottom: i < toc.length-1 ? `1px solid ${P.ruleLight}` : 'none' }}>
                <div style={{ fontSize:12, color:P.accentColor, fontFamily:mono, letterSpacing:'0.06em', marginBottom:10 }}>{s.n}</div>
                <h2 style={{ fontSize:28, fontWeight:500, margin:0, letterSpacing:'-0.018em', color:P.ink }}>{s.t}</h2>
                <p style={{ fontSize:15, color:P.ink3, lineHeight:1.65, marginTop:14, maxWidth:620 }}>{s.d}. The protocol defines a deterministic envelope: agent_did, parent_delegation, scope, expires_at, payload_digest, sig_ed25519. All fields are RFC 8785 canonicalized before signing.</p>
                <pre style={{ marginTop:18, padding:'14px 18px', background:P.bg, border:`1px solid ${P.ruleLight}`, borderRadius:6, fontFamily:mono, fontSize:12.5, lineHeight:1.6, color:P.ink2, overflow:'auto' }}>
{`{
  "agent_did": "did:key:z6Mki...",
  "scope":     ["read:calendar", "spend:usd:50"],
  "expires":   "2026-05-15T00:00:00Z",
  "sig":       "ed25519:..."
}`}
                </pre>
              </article>
            ))}
          </main>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ── 2. ROADMAP ──────────────────────────────────────────────────
function AeoessRoadmap({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 72;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  const QUARTERS = [
    { q:'Q2 2026', state:'now', items:[
      { s:'shipped', t:'SDK 2.6.0-alpha.0 on npm', d:'Evidentiary type safety. 2,884 tests passing.' },
      { s:'shipped', t:'Python SDK 2.4.0a1', d:'Cross-language byte-parity verified across 27 fixtures.' },
      { s:'progress', t:'Drift prevention infrastructure', d:'Pre-commit + CI scan across eight repos.' },
      { s:'progress', t:'Vocab phantom-issuer audit', d:'Single-source-of-truth discipline.' },
    ]},
    { q:'Q3 2026', state:'next', items:[
      { s:'planned', t:'OpenLineage merge', d:'AgentAttributionRunFacet, first AEOESS contribution to LF.' },
      { s:'planned', t:'AAIF Linux Foundation handoff', d:'Project proposal #14 advancing.' },
      { s:'planned', t:'Multi-region gateway', d:'EU + APAC enforcement edges.' },
      { s:'planned', t:'Rust SDK alpha', d:'Third runtime, byte-identical with TS/Python.' },
    ]},
    { q:'Q4 2026', state:'horizon', items:[
      { s:'planned', t:'IETF WG adoption', d:'Move from individual draft to working-group draft.' },
      { s:'planned', t:'Hardware attestation', d:'TPM-bound delegation chains.' },
      { s:'planned', t:'Formal verification', d:'TLA+ model of cascade revocation.' },
    ]},
  ];

  const stateColor = (s) => s === 'shipped' ? P.green : s === 'progress' ? P.accentColor : P.ink5;
  const stateGlyph = (s) => s === 'shipped' ? '●' : s === 'progress' ? '◐' : '○';

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-20}px` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Roadmap</SectionEyebrow>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink }}>
            What we're building<br/>and what's next.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.55, color:P.ink3, marginTop:22, maxWidth:640 }}>
            The protocol layer is shipped. We're now widening compatibility, hardening the gateway, and moving toward Linux Foundation stewardship.
          </p>
        </div>
      </section>

      {QUARTERS.map((Q, qi) => (
        <section key={Q.q} style={{ padding:`${sectionPadY-20}px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background: qi % 2 ? P.bg : P.paper }}>
          <div style={{ maxWidth:1080, margin:'0 auto', display:'grid', gridTemplateColumns:'200px 1fr', gap:48, alignItems:'start' }}>
            <div>
              <div style={{ fontFamily:mono, fontSize:12, color:P.ink5, letterSpacing:'0.08em', textTransform:'uppercase' }}>{Q.state}</div>
              <div style={{ fontSize:32, fontWeight:500, letterSpacing:'-0.02em', color:P.ink, marginTop:6 }}>{Q.q}</div>
            </div>
            <div style={{ borderLeft:`1px solid ${P.ruleLight}`, paddingLeft:32 }}>
              {Q.items.map((it, i) => (
                <div key={i} style={{ paddingBottom:20, marginBottom:20, borderBottom: i < Q.items.length-1 ? `1px solid ${P.ruleLight}` : 'none' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
                    <span style={{ color:stateColor(it.s), fontSize:14, lineHeight:1, paddingTop:4 }}>{stateGlyph(it.s)}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:12, flexWrap:'wrap' }}>
                        <h3 style={{ fontSize:16, fontWeight:600, color:P.ink, margin:0, letterSpacing:'-0.005em' }}>{it.t}</h3>
                        <span style={{ fontSize:10.5, color:stateColor(it.s), letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:700, fontFamily:mono }}>{it.s}</span>
                      </div>
                      <p style={{ fontSize:14, color:P.ink3, margin:'6px 0 0', lineHeight:1.55 }}>{it.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ── 3. COMPARE ──────────────────────────────────────────────────
function AeoessCompare({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 72;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  const ROWS = [
    { dim:'Cryptographic identity',     aeoess:'Ed25519, BYO DID', langchain:'–', autogen:'–', crewai:'–' },
    { dim:'Scoped delegation',           aeoess:'Narrow-only chains', langchain:'Manual', autogen:'Manual', crewai:'Manual' },
    { dim:'Cascade revocation',          aeoess:'Tree-wide, instant', langchain:'–', autogen:'–', crewai:'–' },
    { dim:'Signed action receipts',      aeoess:'RFC 8785 envelopes', langchain:'–', autogen:'–', crewai:'–' },
    { dim:'Commerce pre-flight',         aeoess:'4-gate spending control', langchain:'–', autogen:'–', crewai:'–' },
    { dim:'Cross-vendor audit',          aeoess:'Verify without aeoess', langchain:'–', autogen:'–', crewai:'–' },
    { dim:'Framework lock-in',           aeoess:'None, works alongside any', langchain:'Tight', autogen:'Tight', crewai:'Tight' },
    { dim:'Open governance',             aeoess:'Apache-2.0 + IETF draft', langchain:'MIT', autogen:'MIT', crewai:'MIT' },
    { dim:'Production gateway',          aeoess:'Hosted + self-host', langchain:'–', autogen:'–', crewai:'–' },
    { dim:'Independently cited',         aeoess:'UBC PDR, Microsoft', langchain:'–', autogen:'–', crewai:'–' },
  ];

  const Cell = ({ children, accent }) => (
    <td style={{ padding:'14px 18px', fontSize:13.5, color: accent ? P.ink : P.ink4, fontWeight: accent ? 600 : 400, borderTop:`1px solid ${P.ruleLight}`, verticalAlign:'top', lineHeight:1.5 }}>
      {children === '–' ? <span style={{ color:P.ink5 }}>–</span> : children}
    </td>
  );

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-20}px` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Compare</SectionEyebrow>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink, maxWidth:920 }}>
            Most frameworks orchestrate.<br/>AEOESS enforces.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.6, color:P.ink3, marginTop:22, maxWidth:680 }}>
            Agent frameworks help you build agents. AEOESS handles what happens when those agents act in production: who they are, what they're allowed to do, and what the audit trail looks like when they violate a constraint.
          </p>
        </div>
      </section>

      {/* ── Visualization: Trust Mesh ───────────────────────────────── */}
      <section style={{ padding:`${sectionPadY}px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ fontSize:11, color:P.ink5, fontFamily:mono, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:10 }}>The mesh, animated</div>
          <h2 style={{ fontSize:32, fontWeight:500, margin:0, letterSpacing:'-0.02em', color:P.ink }}>Where the protocol lives.</h2>
          <p style={{ fontSize:15, color:P.ink3, lineHeight:1.6, marginTop:14, marginBottom:28, maxWidth:680 }}>
            Frameworks orchestrate; the protocol binds. Agents, humans, services connected by signed delegations and receipts that any auditor can verify without aeoess in the loop.
          </p>
          <div style={{ border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:'#1c1c1e' }}>
            <iframe src="arch-mesh.html" title="Trust Mesh, visualization" loading="lazy"
              style={{ display:'block', width:'100%', height:560, border:0 }}/>
          </div>
        </div>
      </section>

      <section style={{ padding:`${sectionPadY-30}px ${pad}px ${sectionPadY}px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ overflow:'auto', border:`1px solid ${P.ruleLight}`, borderRadius:6 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', background:P.paper }}>
              <thead>
                <tr style={{ background:P.bg }}>
                  <th style={{ padding:'14px 18px', fontSize:11, color:P.ink5, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600, textAlign:'left', fontFamily:mono }}>Capability</th>
                  <th style={{ padding:'14px 18px', fontSize:13, color:P.ink, fontWeight:600, textAlign:'left', borderLeft:`1px solid ${P.ruleLight}` }}>AEOESS</th>
                  <th style={{ padding:'14px 18px', fontSize:13, color:P.ink3, fontWeight:500, textAlign:'left', borderLeft:`1px solid ${P.ruleLight}` }}>LangChain</th>
                  <th style={{ padding:'14px 18px', fontSize:13, color:P.ink3, fontWeight:500, textAlign:'left', borderLeft:`1px solid ${P.ruleLight}` }}>AutoGen</th>
                  <th style={{ padding:'14px 18px', fontSize:13, color:P.ink3, fontWeight:500, textAlign:'left', borderLeft:`1px solid ${P.ruleLight}` }}>CrewAI</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(r => (
                  <tr key={r.dim}>
                    <Cell>{r.dim}</Cell>
                    <Cell accent>{r.aeoess}</Cell>
                    <Cell>{r.langchain}</Cell>
                    <Cell>{r.autogen}</Cell>
                    <Cell>{r.crewai}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize:12.5, color:P.ink5, marginTop:14, fontStyle:'italic' }}>Comparison reflects published OSS surface as of May 2026. Frameworks ship orchestration; AEOESS ships enforcement. They compose.</p>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ── 4. BLOG / DEV LOG ───────────────────────────────────────────
function AeoessBlog({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 72;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  const POSTS = [
    { date:'May 04', kind:'ship', title:'Full website redesign shipped', tease:'33 pages, restrained design language, fully wired navigation, agent-discovery alternates, /sitemap.html overview, runtime dark/light toggle. The site finally matches the protocol.', read:'5 min' },
    { date:'May 02', kind:'ship', title:'SDK 2.6.0-alpha.0 on npm', tease:'v2 evidentiary type safety landed: claim-evidence-types registry with BATCH_ATTESTED and EVIDENCE_CUSTODY_HELD extensions. 2,884 tests passing.', read:'4 min' },
    { date:'May 02', kind:'ship', title:'Python SDK 2.4.0a1 on PyPI', tease:'Full Wave 1 surface ported from TS. Cross-language byte-parity verified across 27 fixtures.', read:'3 min' },
    { date:'May 01', kind:'standard', title:'Vocabulary phantom-issuer audit', tease:'Removed RNWY from behavioral_trust and wallet_intelligence. Single-source-of-truth discipline matters when other people build on your types.', read:'6 min' },
    { date:'Apr 30', kind:'ship', title:'Drift prevention infrastructure live', tease:'Pre-commit hook + CI scan + standardized .gitignore across eight public repos. Four layers, one structural backstop.', read:'5 min' },
    { date:'Apr 30', kind:'traction', title:'Vocab PR #66 merged', tease:'Edison Munoz Duran\'s Agent-DID crosswalk lands as the second co-drafted-with-aeoess crosswalk. Cross-vendor convergence is real.', read:'4 min' },
    { date:'Apr 29', kind:'paper', title:'Paper 8: The Evidence-Safety Gap', tease:'Cryptographic agent governance proves procedural validity, not effect safety. Five omitted-variable classes catalogued.', read:'12 min' },
    { date:'Apr 28', kind:'ship', title:'IPR module on npm', tease:'agent-passport-system@2.5.0 ships canonicalize/envelope/verify for binding agent authority to instruction-file digest.', read:'5 min' },
    { date:'Apr 27', kind:'standard', title:'agent-governance-spec org created', tease:'Cross-vendor spec home, co-edited with Lars Kroehl (MolTrust).', read:'3 min' },
    { date:'Apr 21', kind:'standard', title:'OpenLineage upstream PR opened', tease:'AgentAttributionRunFacet spec, four DCO-signed commits, CI green. First AEOESS contribution to LF-hosted.', read:'6 min' },
    { date:'Apr 18', kind:'paper', title:'Paper 7: Cognitive Attestation', tease:'A cryptographic commitment attached to an agent\'s action record. Envelope spec, three-stage verification.', read:'10 min' },
    { date:'Apr 14', kind:'paper', title:'Governance in the Medium, published', tease:'Unit of agent governance is the population-with-medium, not the agent. Six rounds of adversarial review.', read:'14 min' },
    { date:'Mar 28', kind:'deploy', title:'Gateway on Railway', tease:'Production enforcement at gateway.aeoess.com. Multi-tenant.', read:'5 min' },
  ];

  const kindColor = { ship:P.green, standard:P.blue, paper:P.blue, traction:P.accentColor, deploy:P.accentColor };

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-20}px` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Dev log</SectionEyebrow>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink }}>
            Every commit, paper,<br/>and merge.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.55, color:P.ink3, marginTop:22, maxWidth:600 }}>
            Public progress, in chronological order. We work in the open because the protocol is too important not to.
          </p>
          <div style={{ display:'flex', gap:8, marginTop:24, flexWrap:'wrap' }}>
            {['All', 'Ship', 'Standards', 'Papers', 'Traction'].map((f, i) => (
              <button key={f} style={{
                padding:'6px 14px', borderRadius:999, border:`1px solid ${P.rule}`,
                background: i === 0 ? P.ink : 'transparent', color: i === 0 ? P.paper : P.ink2,
                fontSize:12.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit',
              }}>{f}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:`${sectionPadY-30}px ${pad}px ${sectionPadY}px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          {POSTS.map((p, i) => (
            <a key={i} href="#" style={{
              display:'grid', gridTemplateColumns:'90px 90px 1fr 80px', gap:24, alignItems:'baseline',
              padding:'22px 0', borderTop:`1px solid ${P.ruleLight}`, textDecoration:'none', color:'inherit',
            }}>
              <div style={{ fontFamily:mono, fontSize:12, color:P.ink5 }}>{p.date}</div>
              <div style={{ fontSize:10.5, color:kindColor[p.kind] || P.ink4, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:700, fontFamily:mono }}>{p.kind}</div>
              <div>
                <h3 style={{ fontSize:17, fontWeight:600, color:P.ink, margin:0, letterSpacing:'-0.005em' }}>{p.title}</h3>
                <p style={{ fontSize:14, color:P.ink3, margin:'6px 0 0', lineHeight:1.55, maxWidth:620 }}>{p.tease}</p>
              </div>
              <div style={{ fontSize:12, color:P.ink5, fontFamily:mono, textAlign:'right' }}>{p.read}</div>
            </a>
          ))}
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

Object.assign(window, { AeoessSpec, AeoessCompare, AeoessBlog, SubHeader });
