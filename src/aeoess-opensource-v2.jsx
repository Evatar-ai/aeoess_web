// aeoess-opensource-v1.jsx
// V1: matches the SHAPE of current aeoess.com (chrome, status row, single column,
// dense info ledger) but reframes the hero to the developer-honest opening:
//   eyebrow:  AGENT PASSPORT SYSTEM
//   title:    Open-source enforcement infrastructure for AI agents.
//   status:   ● Protocol Live · Apache-2.0 · installs
//   actions:  GitHub (primary), Read the spec (secondary), npm install one-liner
//
// Reuses the same chrome, capabilities ledger, install commands, stats, citations,
// and footer as the other opensource artboards, so the only thing that changes
// is the hero focus.

const {
  NavDropdown: V1_NavDropdown,
  NavDropdownResources: V1_NavDropdownResources,
  Footer: V1_Footer,
  SectionEyebrow: V1_SectionEyebrow,
  navLink: v1_navLink,
  primaryBtn: v1_primaryBtn,
  secondaryBtn: v1_secondaryBtn,
  sectionH2: v1_sectionH2,
  AeoessMark: V1_AeoessMark,
  ArchitectureMock: V1_ArchitectureMock,
  AEOESS_DARK: V1_AEOESS_DARK,
  UPDATES: V1_UPDATES,
  kindColor: v1_kindColor
} = window;

const V1_CAPABILITIES = [
{ k: 'IDENTITY', v: 'Every agent gets a cryptographic identity. Ed25519 signatures, deterministic canonicalization, verifiable by any auditor.' },
{ k: 'DELEGATION', v: 'Authority can only narrow. A parent can never give a child more scope than it holds. Provable at every step.' },
{ k: 'REPUTATION', v: 'Trust is earned through performance. Each receipt updates a Bayesian score. Scores travel with the passport.' },
{ k: 'COORDINATION', v: 'Agents discover each other through signed capability ads. No central registry, no single point of trust.' },
{ k: 'COMMUNICATION', v: 'Every message is a signed envelope. Tamper-evident, replay-resistant, addressable by DID.' },
{ k: 'GOVERNANCE', v: 'Policies are first-class objects. Versioned, signed, and evaluated at the gateway.' },
{ k: 'COMMERCE', v: 'Spend caps, currency limits, recipient allowlists. Enforced before the call leaves the agent.' },
{ k: 'DATA', v: 'Per-resource scopes. Read vs. write. Time-bounded. Auto-expires.' },
{ k: 'NETWORK', v: 'Egress is gated. Allowlists by host and method. No silent exfiltration.' },
{ k: 'TEMPORAL', v: 'Every passport has a TTL. Every delegation has a TTL. No long-lived credentials by default.' },
{ k: 'ATTRIBUTION', v: 'Every action carries the chain that authorized it. Forensics by replay, not by guessing.' },
{ k: 'COMPOSITION', v: 'Sub-agents inherit a strict subset. Delegation chains form a tree the gateway can revoke at any node.' }];


const V1_HERO_STATS = [
{ v: '150', l: 'MCP tools' },
{ v: '2,884', l: 'Tests passing' },
{ v: '8', l: 'Published papers' }];


const V1_PACKAGES = [
{ l: 'agent-passport-system', v: 'npm' },
{ l: 'agent-passport-system-mcp', v: 'npm' },
{ l: 'agent-passport-system', v: 'PyPI' },
{ l: 'agent-passport-system', v: 'ClawHub' }];


const V1_CITES = [
{ who: 'University of British Columbia', what: 'Personal Data Repositories, validates APS Bayesian reputation model', where: 'Zenodo · doi:10.5281/zenodo.19323172' },
{ who: 'Microsoft Agent Toolkit', what: 'Reference integration of APS for delegation and audit', where: 'PR in review' },
{ who: 'NIST NCCoE', what: 'Concept paper on agent governance primitives', where: 'submitted' }];


const V1_QUICKSTART = `import { createPassport, signDelegation, verifyReceipt } from 'agent-passport-system';

// 1. mint a passport for an agent
const passport = await createPassport({
  identity: 'did:web:agents.example.com:agent-1',
  scopes:   ['read:invoices', 'spend:usd<=200'],
  ttl:      '24h',
});

// 2. sign a delegation that can only narrow the scope
const delegation = await signDelegation(passport, {
  to:     'did:key:z6Mki...sub-agent',
  scopes: ['read:invoices'],
  ttl:    '1h',
});

// 3. every action emits a receipt your auditor can verify
const ok = await verifyReceipt(receipt, { rootPassport: passport });`;

function V2OSHeader({ palette: P, pad }) {
  const [open, setOpen] = React.useState(false);
  return (
    <header style={{ borderBottom: `1px solid ${P.ruleLight}`, background: P.paper, position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `14px ${pad}px`, display: 'flex', alignItems: 'center', gap: 36 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: P.ink, textDecoration: 'none' }}>
          <V1_AeoessMark size={20} color={P.ink} />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.04em' }}>AEOESS</span>
        </a>
        <nav className="aeoess-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 13.5 }}>
          <V1_NavDropdown label="Solutions" palette={P} />
          <a href="/opensource" style={{ ...v1_navLink(P), color: P.ink, fontWeight: 500 }}>Open Source</a>
          <a href="/pricing" style={v1_navLink(P)}>Pricing</a>
          <V1_NavDropdownResources palette={P} />
        </nav>
        <div className="aeoess-nav-desktop" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="#" style={{ ...v1_navLink(P), fontSize: 13 }}>Contact</a>
          <a href="/portal" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            background: P.accentColor, color: P.accentColor === P.ink ? P.paper : '#fff',
            fontSize: 13, fontWeight: 500, borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap'
          }}>Get Started <span style={{ opacity: .7 }}>→</span></a>
        </div>
        <button
          className="aeoess-hamburger"
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
          style={{
            marginLeft:'auto', display:'none', alignItems:'center', justifyContent:'center',
            width:40, height:40, padding:0,
            background:'transparent', border:`1px solid ${P.ruleLight}`,
            borderRadius:4, cursor:'pointer', color:P.ink,
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (<><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></>)
                  : (<><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>)}
          </svg>
        </button>
      </div>
      <div className={`aeoess-mobile-menu${open ? ' open' : ''}`}
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
        <a href="/portal" onClick={() => setOpen(false)}
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

function AeoessOpenSourceV2({ palette, density, showProof, heroFont }) {
  const P = palette;
  const pad = density === 'compact' ? 28 : density === 'comfy' ? 56 : 40;
  const sectionPadY = density === 'compact' ? 64 : density === 'comfy' ? 110 : 88;

  const fontFamily = heroFont === 'inter' ?
  '"Inter", -apple-system, system-ui, sans-serif' :
  heroFont === 'plex' ?
  '"IBM Plex Sans", -apple-system, system-ui, sans-serif' :
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
  const mono = 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace';

  return (
    <div data-aeoess-page="1" style={{ background: P.paper, color: P.ink, fontFamily, minHeight: '100%', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Top nav ────────────────────────────────────────────────── */}
      <V2OSHeader palette={P} pad={pad} />

      {/* ── Hero + Updates rail ───────────────────────────────────── */}
      <section style={{ padding: `${sectionPadY}px ${pad}px ${sectionPadY - 30}px` }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 48, alignItems: 'start'
        }}>
        <div>

          {/* Eyebrow, Protocol Live status row */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, color: P.ink4, marginBottom: 28 }}>
            <span style={{
                width: 9, height: 9, borderRadius: 999, background: P.ink, display: 'inline-block',
                boxShadow: `0 0 0 4px ${P.ink}18`
              }} />
            <span style={{ color: P.ink, fontWeight: 700 }}>Protocol Live</span>
            <span style={{ color: P.ink5 }}>·</span>
            <span style={{ color: P.ink3 }}>Apache-2.0</span>
            <span style={{ color: P.ink5 }}>·</span>
            <a href="#install" style={{ color: P.link, textDecoration: 'none' }}>installs</a>
          </div>

          {/* Headline, open-source positioning */}
          <h1 style={{
              fontSize: 'clamp(40px, 5.4vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.025em',
              fontWeight: 500, margin: 0, color: P.ink, maxWidth: 880
            }}>
            Open-source enforcement<br />infrastructure for AI agents.
          </h1>

          {/* Subhead */}
          <p style={{ fontSize: 16, lineHeight: 1.6, color: P.ink3, marginTop: 22, maxWidth: 680, fontWeight: 400 }}>
            Identity, delegation, accountability for every AI agent, open spec, open SDKs, open MCP. The hosted enforcement gateway that runs production governance is a separate commercial product. Spec compatibility is permanent.
          </p>

          {/* Action row, buttons only, IETF moves below the panels */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 28 }}>
            <a href="https://github.com/aeoess/agent-passport-system" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                background: P.ink, color: P.paper, borderRadius: 4, textDecoration: 'none',
                fontSize: 13.5, fontWeight: 500
              }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
              GitHub
              <span style={{ opacity: .7, fontWeight: 400, marginLeft: 2 }}>aeoess/agent-passport-system</span>
            </a>
            <a href="/passport" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                background: 'transparent', border: `1px solid ${P.rule}`, color: P.ink2,
                borderRadius: 4, textDecoration: 'none', fontSize: 13.5, fontWeight: 500
              }}>Read the spec</a>
            <a href="https://www.npmjs.com/package/agent-passport-system" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                background: 'transparent', border: `1px solid ${P.rule}`, color: P.ink2,
                borderRadius: 4, textDecoration: 'none', fontSize: 13.5, fontWeight: 500
              }}>npm</a>
          </div>
          <div style={{ fontSize: 11.5, color: P.ink5, marginTop: 10, fontFamily: mono, letterSpacing: '0.04em' }}>
            IETF Internet-Draft <span style={{ color: P.ink3 }}>draft-pidlisnyi-aps-00</span>
          </div>

          {/* ─── Panel 1: INSTALL · two commands + version chips ─── */}
          <div style={{
              marginTop: 28,
              border: `1px solid ${P.ruleLight}`, borderRadius: 6, background: P.paper,
              overflow: 'hidden',
            }}>
            <div style={{
              padding: '11px 16px', borderBottom: `1px solid ${P.ruleLight}`,
              fontSize: 10.5, color: P.ink5, fontFamily: mono,
              letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600,
            }}>
              Install
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            }}>
              {[
                '$ npm install agent-passport-system',
                '$ clawhub install agent-passport-system'
              ].map((cmd, i) => (
                <div key={i} style={{
                  padding: '14px 18px', fontFamily: mono, fontSize: 13.5, color: P.ink,
                  background: P.codeBg,
                  borderLeft: i ? `1px solid ${P.ruleLight}` : 'none',
                }}>
                  <span style={{ color: P.ink5 }}>{cmd[0]}</span>{cmd.slice(1)}
                </div>
              ))}
            </div>
            <div style={{
              padding: '12px 18px', borderTop: `1px solid ${P.ruleLight}`,
              display: 'flex', flexWrap: 'wrap', gap: 0, fontSize: 12.5,
            }}>
              {[
                { l: 'npm SDK',    v: 'v2.6.0-alpha.0' },
                { l: 'MCP Server', v: 'v3.1.1' },
                { l: 'ClawHub',    v: 'Skill' },
                { l: 'Python SDK', v: 'v2.4.0a1' },
                { l: 'Papers',     v: '8 →' },
              ].map((c, i) => (
                <a key={c.l} href="#" style={{
                  display: 'flex', alignItems: 'baseline', gap: 6,
                  padding: '4px 14px',
                  borderLeft: i ? `1px solid ${P.ruleLight}` : 'none',
                  textDecoration: 'none',
                }}>
                  <span style={{ fontFamily: mono, fontSize: 10.5, color: P.ink5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.l}</span>
                  <span style={{ color: P.link, fontWeight: 500, fontSize: 12.5 }}>{c.v}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ─── Panel 2: BY THE NUMBERS · stats + footnote + cited ─── */}
          <div style={{
            marginTop: 16,
            border: `1px solid ${P.ruleLight}`, borderRadius: 6, background: P.paper,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '11px 16px', borderBottom: `1px solid ${P.ruleLight}`,
              fontSize: 10.5, color: P.ink5, fontFamily: mono,
              letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600,
            }}>
              By the numbers
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                { v: '8', l: 'Papers' },
                { v: '20',   l: 'Essential tools' },
                { v: '2,884', l: 'Tests' },
              ].map((s, i) => (
                <div key={s.l} style={{
                  padding: '20px 22px',
                  borderLeft: i ? `1px solid ${P.ruleLight}` : 'none',
                }}>
                  <div style={{
                    fontSize: 34, fontWeight: 500, color: P.ink, lineHeight: 1,
                    letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                    fontFamily: '"Newsreader", Georgia, serif'
                  }}>{s.v}</div>
                  <div style={{
                    fontSize: 10.5, color: P.ink5, marginTop: 10,
                    letterSpacing: '0.10em', fontFamily: mono, textTransform: 'uppercase', fontWeight: 600,
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding: '12px 22px', borderTop: `1px solid ${P.ruleLight}`,
              fontSize: 12.5, color: P.ink4, background: P.bg,
            }}>
              Full surface area: <span style={{ color: P.ink2 }}>150 MCP tools, TypeScript + Python SDKs.</span>
            </div>
            {showProof && (
              <div style={{
                padding: '12px 22px', borderTop: `1px solid ${P.ruleLight}`,
                fontSize: 13, lineHeight: 1.55, color: P.ink2, background: P.bg,
                display: 'flex', alignItems: 'baseline', gap: 10,
              }}>
                <span style={{
                  fontFamily: mono, fontSize: 10, color: P.accentColor,
                  letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700,
                  whiteSpace: 'nowrap', paddingTop: 1,
                }}>Cited</span>
                <span>
                  PDR in Production (University of British Columbia) validates APS Bayesian model.{' '}
                  <a href="https://doi.org/10.5281/zenodo.19323172" style={{ color: P.link, textDecoration: 'none' }}>Zenodo</a>
                </span>
              </div>
            )}
          </div>

          {/* QUICK START, core subpath snippet */}
          <div style={{ marginTop: 28 }}>
            <div style={{
                fontSize: 10.5, color: P.ink5, fontFamily: mono,
                letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600,
              }}>
              Quick start <span style={{ color: P.ink4, marginLeft: 4 }}>· Core subpath, curated essentials</span>
            </div>
            <pre style={{
                margin: 0, padding: '16px 18px',
                background: P.codeBg, border: `1px solid ${P.ruleLight}`, borderRadius: 6,
                fontFamily: mono, fontSize: 13, lineHeight: 1.6, color: P.ink, overflow: 'auto'
              }}>
              <code>{`// import the curated essentials
import {
  createPassport, createDelegation,
  evaluateIntent, commercePreflight, generateKeyPair
} from `}<span style={{ color: '#7ecf8c' }}>{`'agent-passport-system/core'`}</span>{`

// full API surface still available at `}<span style={{ color: '#7ecf8c' }}>{`'agent-passport-system'`}</span></code>
            </pre>
          </div>
        </div>

        {/* RIGHT, Updates rail */}
        <aside data-updates-panel="" style={{
            position: 'sticky', top: 90,
            border: `1px solid ${P.ruleLight}`, borderRadius: 6, background: P.paper,
            maxHeight: `calc(100vh - 110px)`, display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
          <div style={{
              padding: '14px 18px', borderBottom: `1px solid ${P.ruleLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: P.ink }}>Updates</div>
            <a href="/blog" style={{ fontSize: 11.5, color: P.link, textDecoration: 'none' }}>Full log →</a>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {(V1_UPDATES || []).map((u, i) =>
              <div key={i} style={{
                padding: '12px 18px',
                borderTop: i === 0 ? 'none' : `1px solid ${P.ruleLight}`
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: P.ink5, fontFamily: mono, minWidth: 36 }}>{u.date}</span>
                  <span style={{ fontSize: 10, color: v1_kindColor(P, u.kind), letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>{u.kind}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: P.ink, lineHeight: 1.4 }}>{u.title}</div>
                <div style={{ fontSize: 11.5, color: P.ink4, lineHeight: 1.5, marginTop: 4 }}>{u.body}</div>
              </div>
              )}
          </div>
        </aside>
        </div>
      </section>

      {/* ── Architecture ───────────────────────────────────────────── */}
      <section style={{ padding: `${sectionPadY - 30}px ${pad}px ${sectionPadY}px`, borderTop: `1px solid ${P.ruleLight}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <V1_SectionEyebrow palette={P}>Architecture</V1_SectionEyebrow>
          <h2 style={v1_sectionH2(P)}>Identity. Delegation. Action. Receipt.</h2>
          <p style={{ fontSize: 15, color: P.ink3, maxWidth: 680, marginTop: 14, marginBottom: 28, lineHeight: 1.6 }}>
            The protocol pairs identity with delegation. Each action signs against both. The receipt is verifiable by any auditor without going through aeoess.
          </p>
          <V1_ArchitectureMock palette={P} height={400} />
        </div>
      </section>

      {/* ── 12 capabilities ledger ─────────────────────────────────── */}
      <section style={{ padding: `${sectionPadY}px ${pad}px`, borderTop: `1px solid ${P.ruleLight}`, background: P.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <V1_SectionEyebrow palette={P}>Capabilities</V1_SectionEyebrow>
          <h2 style={v1_sectionH2(P)}>Twelve primitives in one protocol.</h2>
          <p style={{ fontSize: 15, color: P.ink3, maxWidth: 640, marginTop: 14, marginBottom: 32, lineHeight: 1.6 }}>
            Each primitive is a typed envelope with deterministic canonicalization (RFC 8785) and Ed25519 signatures. The SDK exports them; the MCP server exposes them; the gateway enforces them.
          </p>
          <div style={{ border: `1px solid ${P.ruleLight}`, borderRadius: 6, overflow: 'hidden', background: P.paper }}>
            {V1_CAPABILITIES.map((c, i) =>
            <div key={c.k} style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'baseline',
              padding: '14px 22px',
              borderTop: i === 0 ? 'none' : `1px solid ${P.ruleLight}`
            }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: P.ink, fontFamily: mono, letterSpacing: '0.04em' }}>{c.k}</div>
                <div style={{ fontSize: 14, color: P.ink3, lineHeight: 1.55 }}>{c.v}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Quickstart code ────────────────────────────────────────── */}
      <section style={{ padding: `${sectionPadY}px ${pad}px`, borderTop: `1px solid ${P.ruleLight}`, background: P.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <V1_SectionEyebrow palette={P}>Quick start</V1_SectionEyebrow>
          <h2 style={v1_sectionH2(P)}>Mint, delegate, verify.</h2>
          <p style={{ fontSize: 15, color: P.ink3, maxWidth: 640, marginTop: 14, marginBottom: 28, lineHeight: 1.6 }}>
            Three calls cover the full audit loop. Authority can only narrow. Every action emits a verifiable receipt.
          </p>
          <div style={{ background: P.codeBg, border: `1px solid ${P.ruleLight}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              padding: '10px 18px', borderBottom: `1px solid ${P.ruleLight}`,
              fontSize: 11, color: P.ink5, fontFamily: mono, letterSpacing: '0.06em', textTransform: 'uppercase',
              display: 'flex', justifyContent: 'space-between'
            }}>
              <span>quickstart.ts</span>
              <span>TypeScript</span>
            </div>
            <pre style={{
              margin: 0, padding: '20px 22px', fontFamily: mono, fontSize: 13, lineHeight: 1.65,
              color: P.ink, overflow: 'auto'
            }}>
              <code>{V1_QUICKSTART}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ── Stats row ──────────────────────────────────────────────── */}
      <section style={{ padding: `${sectionPadY - 30}px ${pad}px`, borderTop: `1px solid ${P.ruleLight}` }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: `repeat(${V1_HERO_STATS.length}, 1fr)`, gap: 0,
          border: `1px solid ${P.ruleLight}`, borderRadius: 6, overflow: 'hidden', background: P.paper
        }}>
          {V1_HERO_STATS.map((s, i) =>
          <div key={s.l} style={{
            padding: '24px 28px',
            borderRight: i < V1_HERO_STATS.length - 1 ? `1px solid ${P.ruleLight}` : 'none'
          }}>
              <div style={{
              fontSize: 32, fontWeight: 500, color: P.ink, lineHeight: 1,
              letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums'
            }}>{s.v}</div>
              <div style={{ fontSize: 12.5, color: P.ink4, marginTop: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Independently cited ────────────────────────────────────── */}
      {showProof &&
      <section style={{ padding: `${sectionPadY}px ${pad}px`, borderTop: `1px solid ${P.ruleLight}`, background: P.bg }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <V1_SectionEyebrow palette={P}>Independently cited</V1_SectionEyebrow>
            <h2 style={v1_sectionH2(P)}>Where the protocol shows up outside this repo.</h2>
            <div style={{ marginTop: 32, border: `1px solid ${P.ruleLight}`, borderRadius: 6, overflow: 'hidden', background: P.paper }}>
              {V1_CITES.map((c, i) =>
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '220px 1fr 220px', gap: 24, alignItems: 'baseline',
              padding: '18px 22px',
              borderTop: i === 0 ? 'none' : `1px solid ${P.ruleLight}`
            }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: P.ink }}>{c.who}</div>
                  <div style={{ fontSize: 14, color: P.ink3, lineHeight: 1.5 }}>{c.what}</div>
                  <div style={{ fontSize: 12, color: P.ink5, fontFamily: mono, textAlign: 'right' }}>{c.where}</div>
                </div>
            )}
            </div>
          </div>
        </section>
      }

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: `${sectionPadY + 10}px ${pad}px`, borderTop: `1px solid ${P.ruleLight}`, textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.02em',
            fontWeight: 500, margin: 0, color: P.ink, lineHeight: 1.1
          }}>
            Read the spec, run the SDK, file an issue.
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <a href="https://github.com/aeoess" style={v1_primaryBtn(P)}>GitHub <span style={{ opacity: .75 }}>→</span></a>
            <a href="/passport" style={v1_secondaryBtn(P)}>Spec</a>
            <a href="/blog" style={v1_secondaryBtn(P)}>Dev log</a>
          </div>
        </div>
      </section>

      <V1_Footer palette={P} pad={pad} />
    </div>);

}

Object.assign(window, { AeoessOpenSourceV2 });