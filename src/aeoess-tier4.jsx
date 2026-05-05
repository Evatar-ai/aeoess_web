// aeoess-tier4.jsx, Wallet, Working Group, AMCS, AGENTS.md, 404.
// Restrained system. Reuses SubHeader, Footer, SectionEyebrow, sectionH2.
// Voice canon: no em-dashes, no AI-tells, no "not X but Y".

const T4_MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

function T4Crumb({ palette: P, label }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:8, fontSize:12,
      color:P.ink5, fontFamily:T4_MONO, marginBottom:22, letterSpacing:'0.02em',
    }}>
      <a href="#" style={{ color:P.ink5, textDecoration:'none' }}>aeoess</a>
      <span>/</span>
      <span style={{ color:P.ink3 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// WALLET, agent wallet, Nano + multi-chain
// ─────────────────────────────────────────────────────────────────
function AeoessWallet({ palette }) {
  const P = palette;
  const pad = 40;
  const { SubHeader, Footer, SectionEyebrow, primaryBtn, secondaryBtn, sectionH2 } = window;

  const RAILS = [
    { c:'Nano',    s:'live',     fee:'feeless', conf:'sub-second', who:'Default rail · agent-to-agent micropay' },
    { c:'Ethereum', s:'live',    fee:'EIP-1559', conf:'~12s',      who:'L2 settlement · stablecoin' },
    { c:'Solana',   s:'live',    fee:'~$0.00025', conf:'~400ms',  who:'High-volume tasks' },
    { c:'Bitcoin',  s:'live',    fee:'L1 / Lightning', conf:'~10m / instant', who:'Long-form settlement' },
    { c:'Polygon',  s:'beta',    fee:'~$0.001',  conf:'~2s',       who:'Cross-tenant balancing' },
    { c:'Base',     s:'beta',    fee:'~$0.0008', conf:'~2s',       who:'L2 settlement' },
  ];

  const TX = [
    { t:'14:02:19', from:'agt:7c1f…', to:'svc:edgar', kind:'data',  amt:'$0.0008',  rail:'nano' },
    { t:'14:02:18', from:'agt:1a9b…', to:'agt:7c1f…', kind:'split', amt:'$0.18',    rail:'nano' },
    { t:'14:02:17', from:'agt:c200…', to:'svc:fx',    kind:'data',  amt:'$0.0001',  rail:'nano' },
    { t:'14:02:14', from:'agt:9d44…', to:'svc:vision',kind:'tool',  amt:'$0.012',   rail:'eth-l2' },
    { t:'14:02:11', from:'agt:b7c5…', to:'agt:e811…', kind:'tip',   amt:'$0.005',   rail:'nano' },
    { t:'14:02:09', from:'agt:7c1f…', to:'svc:edgar', kind:'data',  amt:'$0.0008',  rail:'nano' },
  ];

  const railColor = (r) => r === 'nano' ? P.green : (r === 'eth-l2' ? P.blue : P.accentColor);
  const stateColor = (s) => s === 'live' ? P.green : '#d97706';

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`72px ${pad}px 32px` }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>
          <T4Crumb palette={P} label="Wallet"/>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink, maxWidth:920 }}>
            One wallet, every rail.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.6, color:P.ink3, marginTop:18, maxWidth:680 }}>
            Multi-chain agent wallet bound to a passport. Default rail is Nano: feeless, sub-second, scoped to a delegation. Bridges to Ethereum, Solana, Bitcoin, and L2s without leaving the gateway.
          </p>
          <div style={{ display:'flex', gap:10, marginTop:24, flexWrap:'wrap' }}>
            <a href="#" style={primaryBtn(P)}>Mint a wallet <span style={{ opacity:.75 }}>→</span></a>
            <a href="#" style={secondaryBtn(P)}>Read the spec</a>
          </div>
        </div>
      </section>

      {/* Wallet card mock + side facts */}
      <section style={{ padding:`32px ${pad}px 56px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1180, margin:'0 auto', display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:20 }}>
          <div style={{
            background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:8, padding:'28px 32px',
          }}>
            <div style={{ fontSize:11, color:P.ink5, fontFamily:T4_MONO, letterSpacing:'0.10em', textTransform:'uppercase' }}>Wallet</div>
            <div style={{ fontFamily:T4_MONO, fontSize:13, color:P.ink2, marginTop:6 }}>wlt:agt-7c1f4a82…b9e0</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, marginTop:24, borderTop:`1px solid ${P.ruleLight}` }}>
              {[
                { l:'Balance',  v:'$1,284.91' },
                { l:'24h flow', v:'+$48.20' },
                { l:'Tx (24h)', v:'1,402' },
              ].map((c, i) => (
                <div key={c.l} style={{
                  padding:'18px 0 0', borderLeft: i ? `1px solid ${P.ruleLight}` : 'none', paddingLeft: i ? 22 : 0,
                }}>
                  <div style={{ fontSize:11, color:P.ink5, fontFamily:T4_MONO, letterSpacing:'0.08em', textTransform:'uppercase' }}>{c.l}</div>
                  <div style={{ fontSize:24, fontWeight:500, letterSpacing:'-0.018em', color:P.ink, marginTop:6 }}>{c.v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop:28 }}>
              <div style={{ fontSize:11, color:P.ink5, fontFamily:T4_MONO, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Recent</div>
              <div style={{ border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden' }}>
                {TX.map((row, i) => (
                  <div key={i} style={{
                    display:'grid', gridTemplateColumns:'80px 1fr 60px 90px', gap:14, alignItems:'center',
                    padding:'12px 16px', borderTop: i ? `1px solid ${P.ruleLight}` : 'none',
                    fontFamily:T4_MONO, fontSize:12,
                  }}>
                    <span style={{ color:P.ink5 }}>{row.t}</span>
                    <span style={{ color:P.ink2 }}>{row.from} <span style={{ color:P.ink5, margin:'0 6px' }}>→</span> {row.to}</span>
                    <span style={{
                      padding:'2px 6px', fontSize:10, letterSpacing:'0.06em',
                      background:`${railColor(row.rail)}1a`, color:railColor(row.rail),
                      borderRadius:3, textTransform:'uppercase', textAlign:'center', fontWeight:600,
                    }}>{row.rail}</span>
                    <span style={{ color:P.ink, textAlign:'right', fontWeight:500 }}>{row.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { v:'<1s', l:'Nano confirmation', d:'Default rail for agent-to-agent settlement' },
              { v:'$0', l:'Nano fee', d:'Feeless. Bounded by passport rate-limits' },
              { v:'4-gate', l:'Per outbound transfer', d:'Scope · budget · allowlist · delegation' },
              { v:'1 call', l:'Cascade revoke', d:'Kills the wallet across every bound rail' },
            ].map(c => (
              <div key={c.l} style={{
                padding:'18px 22px', background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6,
                display:'grid', gridTemplateColumns:'90px 1fr', gap:18, alignItems:'baseline',
              }}>
                <div style={{ fontSize:24, fontWeight:500, letterSpacing:'-0.02em', color:P.ink }}>{c.v}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:P.ink2 }}>{c.l}</div>
                  <div style={{ fontSize:13, color:P.ink4, marginTop:4, lineHeight:1.5 }}>{c.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rails table */}
      <section style={{ padding:`72px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Rails</SectionEyebrow>
          <h2 style={sectionH2(P)}>Six rails, one delegation surface.</h2>
          <div style={{ marginTop:28, background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:P.bg }}>
                  {['Chain','State','Fee','Confirmation','Where it fits'].map((h, i) => (
                    <th key={h} style={{
                      padding:'14px 18px', textAlign:'left', fontSize:11, color:P.ink5,
                      fontFamily:T4_MONO, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600,
                      borderLeft: i ? `1px solid ${P.ruleLight}` : 'none',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RAILS.map((r, i) => (
                  <tr key={r.c}>
                    <td style={{ padding:'14px 18px', fontSize:14, fontWeight:600, color:P.ink, borderTop:`1px solid ${P.ruleLight}` }}>{r.c}</td>
                    <td style={{ padding:'14px 18px', borderTop:`1px solid ${P.ruleLight}`, borderLeft:`1px solid ${P.ruleLight}` }}>
                      <span style={{
                        padding:'2px 8px', fontSize:10.5, letterSpacing:'0.06em', fontWeight:600,
                        background:`${stateColor(r.s)}1a`, color:stateColor(r.s),
                        textTransform:'uppercase', borderRadius:3, fontFamily:T4_MONO,
                      }}>{r.s}</span>
                    </td>
                    <td style={{ padding:'14px 18px', fontFamily:T4_MONO, fontSize:12.5, color:P.ink2, borderTop:`1px solid ${P.ruleLight}`, borderLeft:`1px solid ${P.ruleLight}` }}>{r.fee}</td>
                    <td style={{ padding:'14px 18px', fontFamily:T4_MONO, fontSize:12.5, color:P.ink2, borderTop:`1px solid ${P.ruleLight}`, borderLeft:`1px solid ${P.ruleLight}` }}>{r.conf}</td>
                    <td style={{ padding:'14px 18px', fontSize:13, color:P.ink3, borderTop:`1px solid ${P.ruleLight}`, borderLeft:`1px solid ${P.ruleLight}` }}>{r.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// WORKING GROUP
// ─────────────────────────────────────────────────────────────────
function AeoessWorkingGroup({ palette }) {
  const P = palette;
  const pad = 40;
  const { SubHeader, Footer, SectionEyebrow, primaryBtn, secondaryBtn, sectionH2 } = window;

  const SPECS = [
    { id:'QSP-1',  title:'Quantum Signature Profile v1',     state:'ratified', date:'Mar 24',
      desc:'Composite Ed25519 + ML-DSA-65. Hybrid signature envelope, byte-stable across implementations.' },
    { id:'DID-RES',title:'DID Resolution Conformance',        state:'ratified', date:'Mar 24',
      desc:'Resolution semantics across did:key, did:web, did:aps. Failure modes, caching rules, fallback policy.' },
    { id:'EV-VER', title:'Entity Verification',                state:'ratified', date:'Mar 24',
      desc:'Five-tier evidentiary model. What an issuer must produce to be considered authoritative for a claim.' },
    { id:'CTEF-031',title:'Composition Test for Evidentiary Format', state:'review', date:'Apr 23',
      desc:'Per-layer four-row composition grammar. Adopted verbatim from APS into §6.3 normative.' },
    { id:'A2A-EXT',title:'A2A claim_type discriminator',       state:'review', date:'Apr 24',
      desc:'Discriminator over identity, transport, authority, continuity. Aligns to CTEF v0.3.1, no proto changes.' },
    { id:'GAP-1', title:'Governance Attestation Predicate',   state:'draft',   date:'Apr 26',
      desc:'in-toto sibling to nobulex Decision Receipt. JWS + Ed25519, five fixture vectors.' },
  ];

  const stateColor = (s) => s === 'ratified' ? P.green : (s === 'review' ? '#d97706' : P.ink5);

  const MEMBERS = [
    { o:'AEOESS',                role:'editor' },
    { o:'MolTrust',              role:'co-editor' },
    { o:'AgentNexus',            role:'contributor' },
    { o:'AgentID',               role:'contributor' },
    { o:'Nobulex',               role:'contributor' },
    { o:'HiveTrust',             role:'contributor' },
    { o:'VeritasActa',           role:'contributor' },
    { o:'qntm',                  role:'contributor' },
    { o:'continuity-analyzer',   role:'contributor' },
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`72px ${pad}px 32px` }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>
          <T4Crumb palette={P} label="Working group"/>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink, maxWidth:920 }}>
            Where the protocol gets settled.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.6, color:P.ink3, marginTop:18, maxWidth:680 }}>
            Cross-vendor specifications, ratified in public. AEOESS edits. The room is whoever ships compatible code and shows up to review.
          </p>
        </div>
      </section>

      {/* Specs table */}
      <section style={{ padding:`32px ${pad}px 56px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1180, margin:'0 auto', background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden' }}>
          <div style={{ padding:'14px 22px', borderBottom:`1px solid ${P.ruleLight}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:600, color:P.ink }}>Specifications</div>
            <div style={{ fontSize:11, color:P.ink5, fontFamily:T4_MONO, letterSpacing:'0.08em', textTransform:'uppercase' }}>3 ratified · 2 review · 1 draft</div>
          </div>
          {SPECS.map((s, i) => (
            <div key={s.id} style={{
              padding:'22px 26px', borderTop: i ? `1px solid ${P.ruleLight}` : 'none',
              display:'grid', gridTemplateColumns:'120px 1fr 110px 80px', gap:24, alignItems:'baseline',
            }}>
              <div style={{ fontFamily:T4_MONO, fontSize:12, color:P.ink4, letterSpacing:'0.04em', fontWeight:500 }}>{s.id}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:P.ink, letterSpacing:'-0.005em' }}>{s.title}</div>
                <div style={{ fontSize:13.5, color:P.ink3, marginTop:6, lineHeight:1.55 }}>{s.desc}</div>
              </div>
              <div>
                <span style={{
                  padding:'2px 8px', fontSize:10.5, letterSpacing:'0.06em', fontWeight:600,
                  background:`${stateColor(s.state)}1a`, color:stateColor(s.state),
                  textTransform:'uppercase', borderRadius:3, fontFamily:T4_MONO,
                }}>{s.state}</span>
              </div>
              <div style={{ fontFamily:T4_MONO, fontSize:11.5, color:P.ink5, textAlign:'right' }}>{s.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Members */}
      <section style={{ padding:`72px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Participants</SectionEyebrow>
          <h2 style={sectionH2(P)}>Who shows up.</h2>
          <p style={{ fontSize:14.5, color:P.ink3, marginTop:14, maxWidth:640, lineHeight:1.6 }}>
            Membership is shipped code. An organization joins by publishing an implementation that round-trips a spec fixture.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:0, marginTop:28, border:`1px solid ${P.ruleLight}`, borderRadius:6, background:P.paper, overflow:'hidden' }}>
            {MEMBERS.map((m, i) => {
              const col = i % 3, row = Math.floor(i / 3);
              return (
                <div key={m.o} style={{
                  padding:'20px 24px',
                  borderTop: row > 0 ? `1px solid ${P.ruleLight}` : 'none',
                  borderLeft: col > 0 ? `1px solid ${P.ruleLight}` : 'none',
                  display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12,
                }}>
                  <div style={{ fontSize:14.5, fontWeight:600, color:P.ink, letterSpacing:'-0.005em' }}>{m.o}</div>
                  <div style={{ fontFamily:T4_MONO, fontSize:11, color:P.ink5, letterSpacing:'0.06em', textTransform:'uppercase' }}>{m.role}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AMCS, AI Media Credentialing Spec
// ─────────────────────────────────────────────────────────────────
function AeoessAMCS({ palette }) {
  const P = palette;
  const pad = 40;
  const { SubHeader, Footer, SectionEyebrow, primaryBtn, secondaryBtn, sectionH2 } = window;

  const FIELDS = [
    { f:'subject',          t:'DID URI', d:'The artifact under credential. Resolves to a content hash.' },
    { f:'issuer',           t:'DID URI', d:'The publisher attaching terms. Must be a registered passport.' },
    { f:'terms_block',      t:'JSON',    d:'Behavioral derivation rights. What an agent may do with the bytes.' },
    { f:'attribution_root', t:'sha-256', d:'Merkle root over D / P / G / C axes. Proof of provenance.' },
    { f:'enforcement_class',t:'enum',    d:'advisory · enforcement · structural. Tells the gateway what to do on violation.' },
    { f:'expires',          t:'iso-8601',d:'Terms TTL. Cascades on expiry.' },
    { f:'signature',        t:'ed25519', d:'Detached JWS over RFC 8785 canonical bytes.' },
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`72px ${pad}px 32px` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <T4Crumb palette={P} label="AMCS"/>
          <div style={{ fontFamily:T4_MONO, fontSize:11, color:P.accentColor, letterSpacing:'0.10em', fontWeight:600, marginBottom:14 }}>SPEC · v0.1.0</div>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 64px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink, maxWidth:920 }}>
            AI Media<br/>Credentialing Spec.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.6, color:P.ink3, marginTop:18, maxWidth:680 }}>
            A signed credential attached to media that travels with the bytes. Subject, issuer, terms, attribution root, enforcement class. Verifiable at fetch time, cascade-revocable on misuse.
          </p>
          <div style={{ display:'flex', gap:10, marginTop:24, flexWrap:'wrap' }}>
            <a href="#" style={primaryBtn(P)}>Read v0.1.0 <span style={{ opacity:.75 }}>→</span></a>
            <a href="#" style={secondaryBtn(P)}>Reference fixtures</a>
          </div>
        </div>
      </section>

      {/* Envelope sample */}
      <section style={{ padding:`56px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Envelope</SectionEyebrow>
          <h2 style={sectionH2(P)}>One credential, one signature.</h2>
          <pre style={{
            marginTop:28, padding:'24px 28px', background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6,
            fontFamily:T4_MONO, fontSize:12.5, color:P.ink2, lineHeight:1.7, overflow:'auto',
          }}>
{`{
  "@context": "https://aeoess.com/amcs/v1",
  "subject":  "did:web:nytimes.com/article/2026-04-12-fed",
  "issuer":   "did:aps:pub:nytimes.com",
  "terms_block": {
    "behavioral_derivation": "summarize+attribute",
    "retention":             "session-only",
    "training":              "denied"
  },
  "attribution_root":  "sha256:9f2a…b71c",
  "enforcement_class": "enforcement",
  "expires":           "2026-10-12T00:00:00Z",
  "signature":         "ed25519:Aw3kH7…"
}`}
          </pre>
        </div>
      </section>

      {/* Fields */}
      <section style={{ padding:`72px ${pad}px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Fields</SectionEyebrow>
          <h2 style={sectionH2(P)}>Seven required, all signed over.</h2>
          <div style={{ marginTop:28, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:P.paper }}>
            {FIELDS.map((f, i) => (
              <div key={f.f} style={{
                padding:'18px 24px', borderTop: i ? `1px solid ${P.ruleLight}` : 'none',
                display:'grid', gridTemplateColumns:'200px 130px 1fr', gap:24, alignItems:'baseline',
              }}>
                <div style={{ fontFamily:T4_MONO, fontSize:13, color:P.ink, fontWeight:500 }}>{f.f}</div>
                <div style={{ fontFamily:T4_MONO, fontSize:11.5, color:P.ink5, letterSpacing:'0.04em', textTransform:'uppercase' }}>{f.t}</div>
                <div style={{ fontSize:13.5, color:P.ink3, lineHeight:1.55 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AGENTS.MD, landing for agent-readable docs
// ─────────────────────────────────────────────────────────────────
function AeoessAgentsMd({ palette }) {
  const P = palette;
  const pad = 40;
  const { SubHeader, Footer, SectionEyebrow, primaryBtn, secondaryBtn, sectionH2 } = window;

  const FILES = [
    { p:'/AGENTS.md',          t:'project instructions for agents', sz:'4.2 kb' },
    { p:'/llms.txt',           t:'curated docs index for LLMs',     sz:'1.8 kb' },
    { p:'/llms-full.txt',      t:'full technical reference',         sz:'182 kb' },
    { p:'/.well-known/mcp.json', t:'MCP server discovery',           sz:'620 b' },
    { p:'/aps.txt',            t:'governance terms for this site',   sz:'1.1 kb' },
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`72px ${pad}px 32px` }}>
        <div style={{ maxWidth:1020, margin:'0 auto' }}>
          <T4Crumb palette={P} label="For agents"/>
          <h1 style={{ fontSize:'clamp(40px, 5vw, 56px)', lineHeight:1.06, letterSpacing:'-0.022em', fontWeight:500, margin:0, color:P.ink, maxWidth:880 }}>
            Reading this site as an agent.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.65, color:P.ink3, marginTop:18, maxWidth:720 }}>
            This page is for the operator who walked an agent here. Below is the surface meant for the agent. Pull the file that fits the budget you have.
          </p>
        </div>
      </section>

      <section style={{ padding:`24px ${pad}px 56px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1020, margin:'0 auto', background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden' }}>
          {FILES.map((f, i) => (
            <a key={f.p} href={f.p} style={{
              display:'grid', gridTemplateColumns:'2fr 3fr 80px 60px', gap:18, alignItems:'baseline',
              padding:'18px 24px', borderTop: i ? `1px solid ${P.ruleLight}` : 'none',
              textDecoration:'none', color:'inherit',
            }}>
              <span style={{ fontFamily:T4_MONO, fontSize:13.5, color:P.ink, fontWeight:500 }}>{f.p}</span>
              <span style={{ fontSize:13.5, color:P.ink3 }}>{f.t}</span>
              <span style={{ fontFamily:T4_MONO, fontSize:11.5, color:P.ink5, textAlign:'right' }}>{f.sz}</span>
              <span style={{ fontFamily:T4_MONO, fontSize:12, color:P.accentColor, textAlign:'right' }}>open →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Quick-start for agents */}
      <section style={{ padding:`72px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1020, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Quick start, agent edition</SectionEyebrow>
          <h2 style={sectionH2(P)}>Three calls.</h2>
          <pre style={{
            marginTop:28, padding:'24px 28px', background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6,
            fontFamily:T4_MONO, fontSize:12.5, color:P.ink2, lineHeight:1.7, overflow:'auto',
          }}>
{`# 1. discover the protocol surface
GET https://aeoess.com/.well-known/mcp.json

# 2. mint a passport (curated essentials)
POST mcp://aps/passport.create
  { "subject": "agt:my-agent" }

# 3. evaluate an intent before you act
POST mcp://aps/intent.evaluate
  { "passport": "...", "intent": { ... } }

# the gateway answers Allow or Deny(reason). that is the loop.
`}
          </pre>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 404
// ─────────────────────────────────────────────────────────────────
function AeoessNotFound({ palette }) {
  const P = palette;
  const pad = 40;
  const { SubHeader, Footer, primaryBtn, secondaryBtn } = window;

  const LINKS = [
    { t:'Spec',          h:'passport.html' },
    { t:'Roadmap',       h:'roadmap.html' },
    { t:'API reference', h:'docs.html' },
    { t:'Status',        h:'status.html' },
    { t:'Blog',          h:'blog.html' },
    { t:'Portal',        h:'portal.html' },
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%', display:'flex', flexDirection:'column' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ flex:1, padding:`120px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, display:'flex', alignItems:'center' }}>
        <div style={{ maxWidth:780, margin:'0 auto', width:'100%' }}>
          <div style={{ fontFamily:T4_MONO, fontSize:11, color:P.ink5, letterSpacing:'0.10em', fontWeight:600, marginBottom:16 }}>HTTP · 404</div>
          <h1 style={{ fontSize:'clamp(56px, 8vw, 96px)', lineHeight:1, letterSpacing:'-0.03em', fontWeight:500, margin:0, color:P.ink }}>
            That page<br/>does not exist.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.6, color:P.ink3, marginTop:24, maxWidth:560 }}>
            The link is wrong or the page moved. Here are the surfaces most people are looking for. The protocol is unchanged.
          </p>

          <div style={{ marginTop:32, display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:0, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:P.paper }}>
            {LINKS.map((l, i) => {
              const col = i % 3, row = Math.floor(i / 3);
              return (
                <a key={l.h} href={l.h} style={{
                  padding:'20px 22px', textDecoration:'none', color:P.ink2,
                  borderTop: row > 0 ? `1px solid ${P.ruleLight}` : 'none',
                  borderLeft: col > 0 ? `1px solid ${P.ruleLight}` : 'none',
                  display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12,
                  fontSize:14, fontWeight:500,
                }}>
                  <span>{l.t}</span>
                  <span style={{ color:P.ink5, fontFamily:T4_MONO, fontSize:12 }}>→</span>
                </a>
              );
            })}
          </div>

          <div style={{ display:'flex', gap:10, marginTop:28, flexWrap:'wrap' }}>
            <a href="/" style={primaryBtn(P)}>Back to home</a>
            <a href="https://github.com/aeoess" style={secondaryBtn(P)}>GitHub</a>
          </div>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

Object.assign(window, { AeoessWallet, AeoessWorkingGroup, AeoessAMCS, AeoessAgentsMd, AeoessNotFound });
