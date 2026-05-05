// aeoess-subpages-2.jsx, FAQ, Portal (sign-in), Pricing
// Same Restrained design language.

const {
  AeoessMark, NavDropdown, NavDropdownResources, Footer, SectionEyebrow,
  navLink, primaryBtn, secondaryBtn, sectionH2, SubHeader,
} = window;

// ── 5. FAQ ──────────────────────────────────────────────────────
function AeoessFAQ({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 72;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  const FAQ_GROUPS = [
    { g:'Protocol', items:[
      { q:'What does the protocol do?', a:'AEOESS makes every AI agent accountable. Every agent gets a cryptographic identity (Ed25519). Authority can only narrow, never expand. Trust is earned through performance. One API call revokes all downstream access.' },
      { q:'How is it different from agent frameworks?', a:'Most frameworks handle orchestration. AEOESS handles enforcement: what can this agent do, and what happens when it violates a constraint? Bring your own identity. The gateway is both judge and executor. Works with any framework.' },
      { q:'Is this production-ready?', a:'127 modules across SDK, MCP, and Python implementations. 2,884 tests. Eight published papers in the federal record. An IETF Internet-Draft. Independently cited by PDR in Production (UBC). 25 vocab crosswalks.' },
    ]},
    { g:'Identity & delegation', items:[
      { q:'How does delegation work?', a:'A human delegates authority to an agent with explicit scope: tools, money, services. The agent can sub-delegate, but authority can only narrow, never expand. Revoke the root and everything downstream dies instantly.' },
      { q:'How does revocation work at scale?', a:'Cascade revocation. Delegation chains form a tree. Revoke any node and every downstream delegation dies instantly. The gateway enforces this at the boundary, so revoked agents can\'t sneak through on cached credentials.' },
      { q:'What identity systems are supported?', a:'Bring your own: did:key, did:web, SPIFFE SVID, OAuth. Cross-language: signatures round-trip TS ↔ Python byte-identically across 27 fixtures.' },
    ]},
    { g:'Adoption & licensing', items:[
      { q:'What\'s the pricing?', a:'The protocol and SDK are free and open source (Apache-2.0). Always will be. The hosted enforcement gateway has a free plan (3 agents, 1K evals), Team $99/mo, Enterprise custom.' },
      { q:'Can I self-host?', a:'Yes. The gateway image is published. You own your keys, your audit log, and your enforcement decisions. The hosted version exists for convenience, not lock-in.' },
      { q:'Who else has adopted this?', a:'Microsoft Agent Toolkit (PR in review). MolTrust co-edits the spec. Edison Munoz Duran contributed the Agent-DID crosswalk. UBC PDR in Production cites the Bayesian model. Federal agency review underway.' },
      { q:'How do I contribute?', a:'GitHub issues, vocab PRs, conformance fixtures. The agent-governance-spec org is the cross-vendor home; aeoess/agent-passport-system is the reference SDK.' },
    ]},
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-20}px` }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Frequently asked</SectionEyebrow>
          <h1 style={{ fontSize: 'clamp(34px, 4.6vw, 54px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink }}>
            The questions a developer<br/>asks first.
          </h1>
        </div>
      </section>

      {FAQ_GROUPS.map((G, gi) => (
        <section key={G.g} style={{ padding:`${sectionPadY-30}px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background: gi % 2 ? P.bg : P.paper }}>
          <div style={{ maxWidth:1080, margin:'0 auto', display:'grid', gridTemplateColumns:'260px 1fr', gap:48, alignItems:'start' }}>
            <div>
              <div style={{ fontFamily:mono, fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase' }}>§ {gi+1}</div>
              <h2 style={{ fontSize:24, fontWeight:500, letterSpacing:'-0.015em', color:P.ink, marginTop:6, lineHeight:1.2 }}>{G.g}</h2>
            </div>
            <div>
              {G.items.map((f, i) => (
                <details key={i} style={{
                  borderTop: i === 0 ? `1px solid ${P.rule}` : `1px solid ${P.ruleLight}`,
                  borderBottom: i === G.items.length - 1 ? `1px solid ${P.rule}` : 'none',
                  padding:'18px 0',
                }}>
                  <summary style={{ cursor:'pointer', listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:15.5, fontWeight:600, color:P.ink }}>
                    {f.q}<span style={{ color:P.ink5, fontSize:18 }}>+</span>
                  </summary>
                  <p style={{ fontSize:14, lineHeight:1.65, color:P.ink3, margin:'12px 0 0', maxWidth:680 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ── 6. PORTAL (sign-in) ─────────────────────────────────────────
function AeoessPortal({ palette }) {
  const P = palette;
  const pad = 40;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  return (
    <div style={{ background:P.bg, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%', display:'flex', flexDirection:'column' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ flex:1, padding:`80px ${pad}px`, display:'grid', placeItems:'center' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, maxWidth:980, width:'100%', border:`1px solid ${P.ruleLight}`, borderRadius:8, overflow:'hidden', background:P.paper }}>

          {/* Left, sign in */}
          <div style={{ padding:'56px 48px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
              <AeoessMark size={20} color={P.ink}/>
              <span style={{ fontSize:16, fontWeight:600, letterSpacing:'-0.01em' }}>Aeoess Portal</span>
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 4.6vw, 54px)', fontWeight:500, letterSpacing:'-0.02em', margin:0, lineHeight:1.15, color:P.ink }}>
              Sign in to your<br/>governance dashboard.
            </h1>
            <p style={{ fontSize:14, color:P.ink3, marginTop:12, marginBottom:32, lineHeight:1.55 }}>
              Manage agents, view receipts, and revoke delegations. Your keys stay yours.
            </p>

            {/* Email field */}
            <label style={{ display:'block', fontSize:12, color:P.ink4, marginBottom:6, fontWeight:500 }}>Work email</label>
            <input type="email" placeholder="you@company.com" style={{
              width:'100%', padding:'10px 14px', fontSize:14, color:P.ink,
              border:`1px solid ${P.rule}`, borderRadius:4, background:P.paper, fontFamily:'inherit',
              boxSizing:'border-box',
            }}/>

            <button style={{
              width:'100%', marginTop:14, padding:'11px 16px',
              background:P.ink, color:P.paper, border:'none', borderRadius:4,
              fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit',
            }}>Continue with email →</button>

            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0', color:P.ink5, fontSize:11.5 }}>
              <div style={{ flex:1, height:1, background:P.ruleLight }}/>
              <span style={{ letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:mono }}>or</span>
              <div style={{ flex:1, height:1, background:P.ruleLight }}/>
            </div>

            {[
              { l:'Continue with GitHub', i:'gh' },
              { l:'Continue with Google', i:'g' },
              { l:'Continue with SSO',    i:'sso' },
            ].map(o => (
              <button key={o.i} style={{
                width:'100%', marginBottom:8, padding:'10px 16px',
                background:P.paper, color:P.ink2, border:`1px solid ${P.rule}`, borderRadius:4,
                fontSize:13.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit', textAlign:'left',
              }}>{o.l}</button>
            ))}

            <p style={{ fontSize:11.5, color:P.ink5, marginTop:24, lineHeight:1.5 }}>
              By continuing you agree to the <a href="#" style={{ color:P.link, textDecoration:'none' }}>Terms</a> and <a href="#" style={{ color:P.link, textDecoration:'none' }}>Privacy Policy</a>. Your agent keys never leave your control.
            </p>
          </div>

          {/* Right, proof / context strip */}
          <div style={{ padding:'56px 48px', background:P.bg, borderLeft:`1px solid ${P.ruleLight}` }}>
            <div style={{ fontFamily:mono, fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:18 }}>What you'll see inside</div>
            {[
              { h:'Live agent registry',    b:'Every active agent, parent delegation, scope, and last action, refreshed in real time.' },
              { h:'Action receipts',        b:'Signed envelope log with one-click verification against the public spec.' },
              { h:'Revocation control',     b:'Cascade revoke any node. Downstream agents die instantly at the gateway.' },
              { h:'Spend gates',            b:'Four pre-flight checks before money moves. Set caps per agent, per scope, per day.' },
            ].map((it, i) => (
              <div key={i} style={{ paddingTop:18, marginTop:18, borderTop:`1px solid ${P.ruleLight}` }}>
                <h3 style={{ fontSize:14, fontWeight:600, color:P.ink, margin:0, letterSpacing:'-0.005em' }}>{it.h}</h3>
                <p style={{ fontSize:13, color:P.ink3, lineHeight:1.55, margin:'6px 0 0' }}>{it.b}</p>
              </div>
            ))}

            <div style={{ marginTop:32, padding:'14px 16px', border:`1px solid ${P.ruleLight}`, borderRadius:6, background:P.paper }}>
              <div style={{ fontSize:11, fontFamily:mono, color:P.ink5, marginBottom:8 }}>Most teams sign in with GitHub.</div>
              <div style={{ fontSize:13, color:P.ink2, lineHeight:1.5 }}>Your repo identity bootstraps your first agent, no extra setup.</div>
            </div>
          </div>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

// ── 7. PRICING ──────────────────────────────────────────────────
function AeoessPricing({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 72;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  const TIERS = [
    {
      name:'Open Source', price:'Free', forever:true,
      tag:'Apache-2.0 · forever',
      cta:{ l:'Read the spec', primary:false },
      features:[
        'Full SDK (TS + Python)',
        'MCP server, all 150 tools',
        'Self-host the gateway',
        'IETF-tracked spec',
        'Conformance test suite',
        '8 published papers',
      ],
    },
    {
      name:'Team', price:'$99', period:'/month',
      tag:'For production governance',
      featured:true,
      cta:{ l:'Start 14-day trial', primary:true },
      features:[
        'Everything in Open Source',
        'Hosted gateway, fail-closed enforcement',
        'Up to 25 active agents',
        '50K policy evals / mo',
        'Audit log retention 90d',
        'Email support',
      ],
    },
    {
      name:'Enterprise', price:'Custom',
      tag:'For regulated workloads',
      cta:{ l:'Talk to us', primary:false },
      features:[
        'Everything in Team',
        'SSO, SAML, SCIM',
        'Dedicated region (EU/APAC)',
        'Unlimited agents + evals',
        'Audit log retention 7yr',
        'Onboarding + 24/7 support',
      ],
    },
  ];

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-20}px`, textAlign:'center' }}>
        <div style={{ maxWidth:780, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Pricing</SectionEyebrow>
          <h1 style={{ fontSize: 'clamp(34px, 4.6vw, 54px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink }}>
            Open protocol. Hosted gateway when you need it.
          </h1>
          <p style={{ fontSize:17, lineHeight:1.55, color:P.ink3, marginTop:22, maxWidth:600, margin:'22px auto 0' }}>
            The protocol stays free, forever. Pay only when you want production governance without running infrastructure yourself.
          </p>
        </div>
      </section>

      <section style={{ padding:`${sectionPadY-30}px ${pad}px ${sectionPadY}px`, borderTop:`1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth:1180, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
          {TIERS.map(t => (
            <div key={t.name} style={{
              border: t.featured ? `1px solid ${P.ink}` : `1px solid ${P.ruleLight}`,
              background:P.paper, borderRadius:8, padding:'32px 28px',
              position:'relative',
              boxShadow: t.featured ? `0 1px 0 0 ${P.ruleLight}, 0 8px 24px -12px rgba(0,0,0,0.08)` : 'none',
            }}>
              {t.featured && (
                <div style={{
                  position:'absolute', top:-1, right:24,
                  padding:'4px 10px', background:P.ink, color:P.paper,
                  fontSize:10.5, letterSpacing:'0.10em', textTransform:'uppercase', fontWeight:700,
                  borderBottomLeftRadius:4, borderBottomRightRadius:4, fontFamily:mono,
                }}>Most popular</div>
              )}
              <div style={{ fontSize:13, color:P.ink4, fontWeight:500, marginBottom:6 }}>{t.name}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontSize:40, fontWeight:500, letterSpacing:'-0.025em', color:P.ink, lineHeight:1 }}>{t.price}</span>
                {t.period && <span style={{ fontSize:14, color:P.ink4 }}>{t.period}</span>}
              </div>
              <div style={{ fontSize:12, color:P.ink5, marginTop:8, fontFamily:mono }}>{t.tag}</div>

              <a href="#" style={{
                display:'block', textAlign:'center', marginTop:24, padding:'10px 16px',
                background: t.cta.primary ? P.ink : 'transparent',
                color: t.cta.primary ? P.paper : P.ink,
                border: t.cta.primary ? 'none' : `1px solid ${P.rule}`,
                borderRadius:4, fontSize:13.5, fontWeight:500, textDecoration:'none',
              }}>{t.cta.l}</a>

              <ul style={{ listStyle:'none', padding:0, margin:'28px 0 0' }}>
                {t.features.map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'8px 0', fontSize:13.5, color:P.ink2 }}>
                    <span style={{ color:P.green, marginTop:2 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison fine print */}
        <div style={{ maxWidth:1180, margin:'40px auto 0', padding:'18px 24px', border:`1px solid ${P.ruleLight}`, borderRadius:6, background:P.bg, display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, flexWrap:'wrap' }}>
          <div style={{ fontSize:13, color:P.ink3, lineHeight:1.55 }}>
            <strong style={{ color:P.ink, fontWeight:600 }}>Compatibility is permanent.</strong> Self-host today, switch to hosted later, or never. Your protocol envelopes verify the same way regardless.
          </div>
          <a href="#" style={{ fontSize:13, color:P.link, textDecoration:'none', whiteSpace:'nowrap', fontWeight:500 }}>Compare plans in detail →</a>
        </div>
      </section>

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

Object.assign(window, { AeoessFAQ, AeoessPortal, AeoessPricing });
