// aeoess-restrained.jsx, Direction 1
// Supabase-quiet. Generous whitespace, calm hairline rules, single accent.
// The hero is one line of text on a near-empty page. Cards sit on plain
// surfaces. No gradients, no shadows beyond a single hover lift.

// ── Responsive header for the Restrained landing ─────────────────
function RestrainedHeader({ palette: P, pad }) {
  const [open, setOpen] = React.useState(false);
  return (
    <header style={{ borderBottom: `1px solid ${P.ruleLight}`, background: P.paper, position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: `14px ${pad}px`, display: 'flex', alignItems: 'center', gap: 36 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.ink, textDecoration: 'none' }}>
          <AeoessMark size={20} color={P.ink} />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.04em' }}>AEOESS</span>
        </a>
        <nav className="aeoess-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 13.5, color: P.ink3 }}>
          <NavDropdown label="Solutions" palette={P} />
          <a href="#" style={navLink(P)}>Open Source</a>
          <a href="#" style={navLink(P)}>Pricing</a>
          <NavDropdownResources palette={P} />
        </nav>
        <div className="aeoess-nav-desktop" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" style={{ ...navLink(P), fontSize: 13 }}>Contact</a>
          <button data-theme-toggle aria-label="Toggle theme" style={{
            background: 'none', border: 0, padding: '6px 8px', cursor: 'pointer',
            color: P.ink3, fontSize: 14, lineHeight: 1, marginLeft: 4,
          }}>
            <span data-theme-icon-dark style={{ display: 'inline' }}>☾</span>
            <span data-theme-icon-light style={{ display: 'none' }}>☀</span>
          </button>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            background: P.accentColor, color: P.accentColor === P.ink ? P.paper : '#fff',
            fontSize: 13, fontWeight: 500, borderRadius: 4, textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>Get Started <span style={{ opacity: .7 }}>→</span></a>
        </div>
        <button
          className="aeoess-hamburger"
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
          style={{
            marginLeft:'auto', display:'none',
            alignItems:'center', justifyContent:'center',
            width:40, height:40, padding:0,
            background:'transparent', border:`1px solid ${P.ruleLight}`,
            borderRadius:4, cursor:'pointer', color:P.ink,
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>
            ) : (
              <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>
            )}
          </svg>
        </button>
      </div>
      <div
        className={`aeoess-mobile-menu${open ? ' open' : ''}`}
        style={{
          display:'none', flexDirection:'column',
          borderTop:`1px solid ${P.ruleLight}`, background:P.paper,
          padding:`8px ${pad}px 16px`,
        }}>
        {['Solutions','Open Source','Pricing','Spec','Docs','Resources','Contact'].map((l, i, arr) => (
          <a key={l} href="#" onClick={() => setOpen(false)}
             style={{
               padding:'14px 0', borderBottom: i < arr.length-1 ? `1px solid ${P.ruleLight}` : 'none',
               color:P.ink, textDecoration:'none', fontSize:15, fontWeight:500,
             }}>{l}</a>
        ))}
        <a href="#" onClick={() => setOpen(false)}
           style={{
             marginTop:14, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
             padding:'12px 16px',
             background:P.accentColor, color: P.accentColor === P.ink ? P.paper : '#fff',
             fontSize:14, fontWeight:500, borderRadius:4, textDecoration:'none',
           }}>Get Started <span style={{ opacity:.7 }}>→</span></a>
      </div>
    </header>
  );
}

function AeoessRestrained({ palette, density, pillarCount, showProof, heroFont, showUpdates = true }) {
  const P = palette;
  const pad = density === 'compact' ? 28 : density === 'comfy' ? 56 : 40;
  const sectionPadY = density === 'compact' ? 80 : density === 'comfy' ? 140 : 110;

  const fontFamily = heroFont === 'inter' ?
  '"Inter", -apple-system, system-ui, sans-serif' :
  heroFont === 'plex' ?
  '"IBM Plex Sans", -apple-system, system-ui, sans-serif' :
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';

  const pillars = [
  { h: 'Identity that travels.', b: 'Agents carry verifiable identity across systems. Use existing formats, did:web, OAuth, SPIFFE, or our native passport. No vendor lock-in.' },
  { h: 'Policy enforced, not promised.', b: 'Delegation, scope, spend limits, sunset. All signed and verified at action time. The agent cannot exceed what its delegation authorizes.' },
  { h: 'Audit by default.', b: 'Every action produces a signed receipt. Every receipt is verifiable by your auditor without going through us. Open spec, open code.' },
  { h: 'Open at the protocol layer.', b: 'Apache 2.0 SDK, MCP, Python. The gateway service is a separate commercial product. Spec compatibility is permanent.' }].
  slice(0, pillarCount);

  return (
    <div data-aeoess-page="1" style={{ background: P.paper, color: P.ink, fontFamily, minHeight: '100%', WebkitFontSmoothing: 'antialiased' }}>
      {/* ─── Top nav ─────────────────────────────────────────────── */}
      <RestrainedHeader palette={P} pad={pad} />

      {/* ─── Body, single column OR two-column with Updates ─────── */}
      <section style={{ padding: `${sectionPadY}px ${pad}px ${sectionPadY - 30}px` }}>
        <div style={{
          maxWidth: showUpdates ? 1440 : 1200, margin: '0 auto',
          display: showUpdates ? 'grid' : 'block',
          gridTemplateColumns: showUpdates ? 'minmax(0, 1fr) 320px' : undefined,
          gap: showUpdates ? 56 : 0, alignItems: 'start'
        }}>

          {/* LEFT (or only), hero + arch + solutions + pillars + proof + CTA */}
          <div>
            {/* Hero, 2-col: copy left, demo video right (sits low, near "Built for…" line) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(420px, 520px)',
              gap: 48, alignItems: 'end',
            }}>
              <div>
                <div style={{ fontSize: 11.5, letterSpacing: '0.14em', color: P.accentColor, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase' }}>
                  Agent Passport System
                </div>
                <h1 style={{
                  lineHeight: 1.05, letterSpacing: '-0.02em',
                  fontWeight: 500, margin: 0, color: P.ink, fontSize: "54px"
                }}>
                  The governance<br />layer for AI agents.
                </h1>
                <p style={{ fontSize: 18, lineHeight: 1.5, color: P.ink3, marginTop: 24, maxWidth: 600, fontWeight: 400 }}>
                  Cryptographic identity, scoped delegation, and signed receipts.<br />
                  Built for the four jobs your agents already do.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <a href="#" style={primaryBtn(P)}>Get Started <span style={{ opacity: .75 }}>→</span></a>
                  <a href="#arch" style={secondaryBtn(P)}>See how it works <span style={{ opacity: .6 }}>↓</span></a>
                </div>
              </div>

              {/* Demo video, bottom-anchored, quiet, no chrome label */}
              <figure style={{ margin: 0 }}>
                <div style={{
                  position: 'relative',
                  border: `1px solid ${P.ruleLight}`, borderRadius: 6, overflow: 'hidden',
                  background: '#0a0a0a',
                  boxShadow: `0 1px 0 ${P.ruleLight}, 0 24px 48px -32px rgba(10,10,10,0.45)`,
                }}>
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster="assets/demo-poster.jpg"
                    style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '16 / 9', background: '#0a0a0a' }}
                  >
                    <source src="assets/demo.mp4" type="video/mp4" />
                    Your browser doesn't support HTML5 video.
                  </video>
                </div>
              </figure>
            </div>

            {/* Architecture viz */}
            <div id="arch" style={{ marginTop: sectionPadY }}>
              <SectionEyebrow palette={P}>How it works</SectionEyebrow>
              <h2 style={sectionH2(P)}>One protocol, two sides of the audit.</h2>
              <p style={{ fontSize: 15.5, color: P.ink3, maxWidth: 620, marginTop: 14, marginBottom: 32, lineHeight: 1.55, margin: "14px 0px 32px", padding: "8px", width: "700px" }}>
                Identity proves who delegated. Delegation proves what they authorized. Every action the agent takes is signed against both, and the receipt your auditor reads is verifiable without us.
              </p>
              <ArchitectureMock palette={P} height={380} />
              <div style={{ marginTop: 14, fontSize: 13, color: P.ink4 }}>
                Hover any node. <a href="#" style={{ color: P.link, textDecoration: 'none' }}>Open the full architecture →</a>
              </div>
            </div>

            {/* Solutions */}
            <div style={{ marginTop: sectionPadY }}>
              <SectionEyebrow palette={P}>Solutions</SectionEyebrow>
              <h2 style={sectionH2(P)}>Four jobs your agents already do.</h2>
              <p style={{ fontSize: 15.5, color: P.ink3, maxWidth: 560, marginTop: 14, marginBottom: 36, lineHeight: 1.55 }}>
                Pick the one closest to your team. Each Solutions page goes deeper into rails, primitives, and integration shape.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: density === 'compact' ? 14 : 20 }}>
                {SOLUTIONS.map((s) =>
                <SolutionCard key={s.id} sol={s} palette={P} density={density} variant="restrained" />
                )}
              </div>
            </div>

            {/* Pillars */}
            <div style={{ marginTop: sectionPadY }}>
              <SectionEyebrow palette={P}>Why aeoess</SectionEyebrow>
              <h2 style={sectionH2(P)}>Three things to know.</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${pillars.length}, minmax(0,1fr))`,
                gap: density === 'compact' ? 24 : 36, marginTop: 36
              }}>
                {pillars.map((p, i) =>
                <div key={i}>
                    <div style={{ fontSize: 12.5, color: P.accentColor, letterSpacing: '0.08em', fontWeight: 600, marginBottom: 12 }}>0{i + 1}</div>
                    <h3 style={{ fontSize: 19, fontWeight: 600, color: P.ink, margin: '0 0 10px', letterSpacing: '-0.005em' }}>{p.h}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: P.ink3, margin: 0 }}>{p.b}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Proof */}
            {showProof &&
            <div style={{ marginTop: sectionPadY }}>
                <SectionEyebrow palette={P}>Recognized by</SectionEyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 18, marginTop: 24 }}>
                  {PROOF.map((p, i) =>
                <div key={i} style={{ paddingTop: 16, borderTop: `1px solid ${P.rule}` }}>
                      <div style={{ fontSize: 11, color: P.ink5, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{p.label}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.5, color: P.ink2 }}>{p.body}</div>
                    </div>
                )}
                </div>
              </div>
            }

            {/* OPEN PROTOCOL band, full-width, restrained tone */}
            <div style={{
              marginTop: sectionPadY + 10,
              paddingTop: sectionPadY - 10,
              borderTop: `1px solid ${P.ruleLight}`
            }}>
              <div style={{ fontSize: 11.5, letterSpacing: '0.14em', color: P.accentColor, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase' }}>
                Open source
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.02em',
                fontWeight: 500, margin: 0, color: P.ink, lineHeight: 1.1, maxWidth: 720
              }}>
                OPEN PROTOCOL
              </h2>
              <p style={{
                fontSize: 18, lineHeight: 1.5, color: P.ink2,
                marginTop: 18, maxWidth: 640, fontWeight: 400, fontStyle: 'italic'
              }}>
                A passport system for agents should belong to the world they move through.
              </p>
              <p style={{
                fontSize: 16, lineHeight: 1.6, color: P.ink3,
                marginTop: 14, maxWidth: 640, fontWeight: 400
              }}>
                APS is public infrastructure for agent identity, delegation, enforcement, and receipts.
                Read the spec. Run the gateway. Verify the chain.
              </p>
              <p style={{
                fontSize: 14.5, lineHeight: 1.5, color: P.ink4,
                marginTop: 14, maxWidth: 640, fontWeight: 500, letterSpacing: '0.01em'
              }}>
                No black boxes. No lock-in. No "trust us."
              </p>
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <a href="https://github.com/aeoess" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 0,
                  background: P.paper, border: `1px solid ${P.rule}`, borderRadius: 999,
                  padding: '7px 4px 7px 14px',
                  fontSize: 13, color: P.ink, textDecoration: 'none', fontWeight: 500
                }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 8 }}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
                  <span>@aeoess</span>
                  <span style={{ color: P.ink5, margin: '0 10px' }}>|</span>
                  <span style={{ fontWeight: 700, paddingRight: 12 }}>2.4K</span>
                </a>
                <span style={{ fontSize: 12.5, color: P.ink5 }}>
                  Apache-2.0 · 8 papers · draft-pidlisnyi-aps-00 (IETF)
                </span>
              </div>
            </div>

            {/* Final CTA */}
            <div style={{ marginTop: sectionPadY + 10, paddingTop: sectionPadY - 10, borderTop: `1px solid ${P.ruleLight}`, textAlign: 'left' }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.02em', fontWeight: 500, margin: 0, color: P.ink, lineHeight: 1.1 }}>
                Ready to govern your agents?
              </h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <a href="#" style={primaryBtn(P)}>Get Started <span style={{ opacity: .75 }}>→</span></a>
                <a href="#" style={secondaryBtn(P)}>Talk to us</a>
              </div>
            </div>
          </div>

          {/* RIGHT, sticky Updates panel (only when showUpdates) */}
          {showUpdates &&
          <aside data-updates-panel="" style={{
            position: 'sticky', top: 90,
            border: `1px solid ${P.ruleLight}`, borderRadius: 6, background: P.paper,
            maxHeight: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 18px', borderBottom: `1px solid ${P.ruleLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: P.ink }}>Updates</div>
              <a href="/blog" style={{ fontSize: 11.5, color: P.link, textDecoration: 'none' }}>Full log →</a>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {(window.UPDATES || []).map((u, i) => {
                const kc = window.kindColor ? window.kindColor(P, u.kind) :
                u.kind === 'ship' ? P.green : u.kind === 'paper' || u.kind === 'standard' ? P.blue :
                u.kind === 'traction' || u.kind === 'convergence' ? P.accentColor :
                u.kind === 'deploy' || u.kind === 'rebrand' ? P.red :
                P.ink4;
                return (
                  <div key={i} style={{
                    padding: '12px 18px',
                    borderTop: i === 0 ? 'none' : `1px solid ${P.ruleLight}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: P.ink5, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', minWidth: 36 }}>{u.date}</span>
                      <span style={{ fontSize: 10, color: kc, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>{u.kind}</span>
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: P.ink, lineHeight: 1.4 }}>{u.title}</div>
                    <div style={{ fontSize: 11.5, color: P.ink4, lineHeight: 1.5, marginTop: 4 }}>{u.body}</div>
                  </div>);

              })}
            </div>
          </aside>
          }
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <Footer palette={P} pad={pad} />
    </div>);

}

// ──────────────────────────────────────────────────────────────────
// Shared card / nav / button atoms used across all three directions.
// ──────────────────────────────────────────────────────────────────
const navLink = (P) => ({
  color: P.ink3, textDecoration: 'none', fontSize: 13.5, fontWeight: 450,
  padding: '4px 0', cursor: 'default'
});
const primaryBtn = (P) => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px',
  background: P.accentColor, color: P.accentColor === P.ink ? P.paper : '#fff',
  fontSize: 14, fontWeight: 500, borderRadius: 4, textDecoration: 'none',
  whiteSpace: 'nowrap'
});
const secondaryBtn = (P) => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px',
  background: 'transparent', color: P.ink2, border: `1px solid ${P.rule}`,
  fontSize: 14, fontWeight: 500, borderRadius: 4, textDecoration: 'none',
  whiteSpace: 'nowrap'
});
const sectionH2 = (P) => ({
  fontSize: 'clamp(28px, 3.4vw, 42px)', lineHeight: 1.12, letterSpacing: '-0.018em',
  fontWeight: 500, margin: 0, color: P.ink, maxWidth: 780
});
function SectionEyebrow({ palette, children }) {
  return (
    <div style={{
      fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: palette.ink5, fontWeight: 600, marginBottom: 18
    }}>{children}</div>);

}

function SolutionCard({ sol, palette, density, variant }) {
  const [hover, setHover] = React.useState(false);
  const P = palette;
  const pad = density === 'compact' ? 22 : density === 'comfy' ? 36 : 28;

  if (variant === 'editorial') {
    return (
      <a href="#" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', padding: `${pad + 4}px ${pad}px`, textDecoration: 'none',
        color: P.ink, borderTop: `1px solid ${hover ? P.ink5 : P.rule}`,
        transition: 'border-color .15s, background .15s',
        background: hover ? P.surface : 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <span style={{ fontSize: 11.5, color: P.ink5, fontVariantNumeric: 'tabular-nums' }}>0{SOLUTIONS.findIndex((s) => s.id === sol.id) + 1}</span>
            <div>
              <h3 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.015em', color: P.ink, margin: 0 }}>{sol.title}</h3>
              <div style={{ fontSize: 12.5, color: P.ink5, marginTop: 6, letterSpacing: '0.02em' }}>{sol.tag}</div>
            </div>
          </div>
          <span style={{ color: hover ? P.accentColor : P.ink5, fontSize: 18, transition: 'color .15s' }}>→</span>
        </div>
        <p style={{ fontSize: 17, color: P.ink2, lineHeight: 1.45, margin: '18px 0 0', maxWidth: 640, fontWeight: 450 }}>
          {sol.pitch}
        </p>
        <p style={{ fontSize: 14, color: P.ink4, lineHeight: 1.55, margin: '10px 0 0', maxWidth: 640 }}>
          {sol.body}
        </p>
      </a>);

  }

  // restrained + bold share this card shape with subtle styling differences.
  const isBold = variant === 'bold';
  return (
    <a href="#" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    style={{
      display: 'block', padding: `${pad}px ${pad}px ${pad - 4}px`, textDecoration: 'none',
      background: isBold ? P.paper : P.paper,
      border: `1px solid ${hover ? P.ink5 : P.ruleLight}`,
      borderRadius: isBold ? 10 : 6,
      color: P.ink, transition: 'border-color .15s, box-shadow .15s, transform .15s',
      boxShadow: hover ? P === AEOESS_DARK ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)' : 'none',
      position: 'relative', overflow: 'hidden'
    }}>
      {isBold &&
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: P.accentColor, opacity: hover ? 1 : .0, transition: 'opacity .15s' }} />
      }
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 6,
          background: P.surface,
          color: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <SolutionIcon id={sol.id} size={20} />
        </div>
        <span style={{ fontSize: 11, color: P.ink5, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'right' }}>{sol.tag.split(',')[0].replace('For ', '')}</span>
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: P.ink, margin: '22px 0 6px' }}>{sol.title}</h3>
      <p style={{ fontSize: 15.5, color: P.ink2, fontWeight: 500, lineHeight: 1.4, margin: '0 0 12px' }}>{sol.pitch}</p>
      <p style={{ fontSize: 13.5, color: P.ink4, lineHeight: 1.55, margin: 0, minHeight: 54 }}>{sol.body}</p>
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${P.ruleLight}`, fontSize: 13, color: hover ? P.accentColor : P.ink3, transition: 'color .15s' }}>
        Explore {sol.title} <span style={{ marginLeft: 4 }}>→</span>
      </div>
    </a>);

}

function NavDropdown({ label, palette }) {
  const [open, setOpen] = React.useState(false);
  const P = palette;
  const close = () => setOpen(false);
  return (
    <div data-nav-dropdown="" style={{ position: 'relative' }}
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button style={{ ...navLink(P), display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 0, font: 'inherit', padding: 0 }}>
        {label} <span style={{ fontSize: 9, opacity: .6, marginTop: 1 }}>▼</span>
      </button>
      <div data-nav-dropdown-panel="" style={{
        position: 'absolute', top: '100%', left: -12, marginTop: 0, paddingTop: 8,
        opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(-4px)',
        pointerEvents: open ? 'auto' : 'none', transition: 'opacity .15s, transform .15s',
        background: P.paper, border: `1px solid ${P.rule}`, borderRadius: 8,
        padding: 6, minWidth: 340, boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
      }}>
        {SOLUTIONS.map((s) =>
        <a key={s.id} href="#" onClick={close}
        style={{ display: 'flex', gap: 12, padding: '10px 12px', textDecoration: 'none', color: P.ink, borderRadius: 5 }}
        onMouseEnter={(e) => e.currentTarget.style.background = P.surface}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 28, height: 28, borderRadius: 5, background: P.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SolutionIcon id={s.id} size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: P.ink4, marginTop: 2 }}>{s.tag}</div>
            </div>
          </a>
        )}
      </div>
    </div>);

}

function NavDropdownResources({ palette }) {
  const [open, setOpen] = React.useState(false);
  const P = palette;
  const items = [['Blog', '/blog'], ['Roadmap', '/roadmap'], ['Spec', '/passport'], ['FAQ', '/faq'], ['Compare', '/compare']];
  return (
    <div data-nav-dropdown="" style={{ position: 'relative' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button style={{ ...navLink(P), display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 0, font: 'inherit', padding: 0 }}>
        Resources <span style={{ fontSize: 9, opacity: .6, marginTop: 1 }}>▼</span>
      </button>
      <div data-nav-dropdown-panel="" style={{
        position: 'absolute', top: '100%', left: -12, marginTop: 0, paddingTop: 8,
        opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(-4px)',
        pointerEvents: open ? 'auto' : 'none', transition: 'opacity .15s, transform .15s',
        background: P.paper, border: `1px solid ${P.rule}`, borderRadius: 8,
        padding: 6, minWidth: 160, boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
      }}>
        {items.map(([l, h]) =>
        <a key={l} href={h} style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: P.ink2, fontSize: 13, borderRadius: 5 }}
        onMouseEnter={(e) => e.currentTarget.style.background = P.surface}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {l}
          </a>
        )}
      </div>
    </div>);

}

function Footer({ palette, pad }) {
  const P = palette;
  const cols = [
  ['Solutions', ['Payments', 'Content', 'Compliance', 'Enterprise']],
  ['Open Source', ['Spec', 'SDK', 'MCP', 'GitHub']],
  ['Resources', ['Blog', 'Roadmap', 'FAQ', 'Compare']],
  ['Company', ['About', 'Contact', 'Press', 'Security']]];

  return (
    <footer style={{ padding: `60px ${pad}px 36px`, borderTop: `1px solid ${P.ruleLight}`, background: P.paper, color: P.ink4, fontSize: 13 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AeoessMark size={18} color={P.ink} />
            <span style={{ fontSize: 13, fontWeight: 600, color: P.ink, letterSpacing: '0.04em' }}>AEOESS</span>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: P.ink4, maxWidth: 280, lineHeight: 1.5 }}>
            Open protocol for governing AI agents. Identity, delegation, accountability.
          </p>
        </div>
        {cols.map(([title, items]) =>
        <div key={title}>
            <div style={{ fontSize: 11.5, color: P.ink3, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>{title}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((it) =>
            <li key={it}><a href="#" style={{ color: P.ink4, textDecoration: 'none', fontSize: 13 }}>{it}</a></li>
            )}
            </ul>
          </div>
        )}
      </div>
      <div style={{ maxWidth: 1100, margin: '48px auto 0', paddingTop: 18, borderTop: `1px solid ${P.ruleLight}`, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: P.ink5 }}>
        <span>© 2026 aeoess. Apache 2.0 protocol, commercial gateway.</span>
        <span>signal@aeoess.com</span>
      </div>
    </footer>);

}

Object.assign(window, { AeoessRestrained, SolutionCard, NavDropdown, NavDropdownResources, Footer, SectionEyebrow, navLink, primaryBtn, secondaryBtn, sectionH2 });