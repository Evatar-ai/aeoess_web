// Direction 02 — "Glass"

// Live date helpers — used by the passport card so dates always show "today".
function kyaToday() {
  const d = new Date();
  return d.getFullYear() + '·' + String(d.getMonth() + 1).padStart(2, '0') + '·' + String(d.getDate()).padStart(2, '0');
}
function kyaPlusDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '·' + String(d.getMonth() + 1).padStart(2, '0') + '·' + String(d.getDate()).padStart(2, '0');
}
// Cool cyan + periwinkle. Layered translucent protocol cards.
// More depth, more rhythm. Same brief: premium-minimal governance surface.

// ── Tokens (Glass overrides) ──────────────────────────────────
const GL = {
  bg: PX.white,
  paper: PX.paperCyan,
  ink: PX.ink,
  inkSoft: PX.inkSoft,
  inkDim: PX.inkDim,
  inkFaint: PX.inkFaint,
  border: PX.border,
  primary: PX.cyan,
  primary2: '#5b7af0',
  accent: '#8e9ddf',     // periwinkle
  mint: PX.mint,
  rose: PX.rose,
};

// ── Nav ──────────────────────────────────────────────
function GLNav() {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${PX.border}`,
      padding: '20px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: PX.sans, color: PX.ink,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <img src="/assets/images/aeoess_logo-05.png" alt="AEOESS" style={{ height: 28, width: 'auto', display: 'block' }} />
      </div>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', fontSize: 14, color: PX.inkDim, fontWeight: 500 }}>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Protocol</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Passport</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Network</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Enterprise</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Developers</a>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>Docs</a>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href="/portal.html" style={{ fontSize: 14, color: PX.ink, fontWeight: 500, textDecoration: 'none' }}>Sign in</a>
        <PXButton variant="primary" size="sm">Request access →</PXButton>
      </div>
    </div>
  );
}

// ── Hero — vertically stacked, more breathing ──────────────────────────────────
function GLHero() {
  const glTick = useTypewriter(
    ['authenticate', 'authorize', 'audit', 'attest', 'attribute'],
    { typeMs: 80, pauseMs: 1500, deleteMs: 32 }
  );
  return (
    <PXGradientBg variant="glass" grid={true} gridOpacity={0.7}>
      <div style={{ padding: '120px 64px 0', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PXPill color={GL.primary} bg="rgba(110,197,217,0.12)">
            <PXBreathingDot color={GL.primary} size={7} /> &nbsp;AGENT PASSPORT SYSTEM · APS
          </PXPill>
        </div>

        <h1 style={{
          fontFamily: PX.sansDisplay, fontSize: 144, fontWeight: 400, lineHeight: 0.92,
          letterSpacing: '0.005em', color: PX.ink, margin: '40px 0 0', textAlign: 'center',
        }}>
          Model <span style={{ color: GL.primary }}>Citizen</span>.
        </h1>
        <div style={{
          fontFamily: PX.sansDisplay, fontSize: 48, fontWeight: 300, lineHeight: 1.05,
          letterSpacing: '0.005em', color: PX.inkSoft, margin: '24px auto 0', textAlign: 'center', maxWidth: 1100,
          minHeight: 60,
        }}>
          Governance infrastructure for the agentic economy.<br />We <span style={{ color: GL.primary, fontWeight: 500 }}>{glTick}<span style={{ color: GL.primary, animation: 'gl-cursor 1s infinite' }}>▍</span></span> every autonomous agent.
        </div>
        <style>{`@keyframes gl-cursor{50%{opacity:0}}`}</style>
        <div style={{ marginTop: 44, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <PXButton variant="primary" size="lg" onClick={() => { window.location.href = '/opensource.html'; }}>Start building →</PXButton>
          <PXButton variant="ghost" size="lg" onClick={() => { window.location.href = '/protocol.html'; }}>Read the protocol</PXButton>
        </div>

        {/* Layered glass plate — the hero visual */}
        <div data-kya-hero-plate style={{ marginTop: 100, position: 'relative' }}>
          <GLHeroPlate />
        </div>

        {/* Signal wave + stats strip */}
        <div style={{ marginTop: -40, position: 'relative', zIndex: 2 }}>
          <PXSignalWave color={GL.primary} height={120} amplitude={18} frequency={0.014} opacity={0.55} />
        </div>

        <div data-kya-stats style={{ marginTop: 24, padding: '32px 0 80px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            ['231K', 'passports issued'],
            ['0.3–1.1 ms', 'p99 verify'],
            ['29', 'network issuers'],
            ['99.998%', 'uptime · 90d'],
          ].map(([v, k]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: PX.sansDisplay, fontSize: 56, fontWeight: 500, color: PX.ink, letterSpacing: '0.005em', lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkFaint, letterSpacing: '0.22em', marginTop: 12 }}>{k.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </PXGradientBg>
  );
}

// Glass hero plate — translucent stacked panels showing the protocol at a glance
function GLHeroPlate() {
  return (
    <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', height: 480 }}>
      {/* Back layer — signal trace */}
      <PXTranslucentCard hue="cyan" style={{ position: 'absolute', top: 28, left: 60, right: 60, bottom: 28, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkDim, letterSpacing: '0.22em' }}>LIVE TRACE · last 60s</div>
        <div style={{ fontFamily: PX.mono, fontSize: 10, color: GL.primary, letterSpacing: '0.22em' }}>16–36 M ops/sec</div>
      </PXTranslucentCard>

      {/* Mid layer — protocol diagram */}
      <PXTranslucentCard hue="blue" style={{ position: 'absolute', top: 56, left: 24, right: 24, bottom: 56, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 32px', borderBottom: `1px solid ${PX.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkDim, letterSpacing: '0.18em' }}>PROTOCOL · KYA / VERIFY / 1.0</div>
          <PXPill color={GL.mint} bg="rgba(125,201,176,0.14)"><PXBreathingDot color={GL.mint} size={6} /> &nbsp;OPERATIONAL</PXPill>
        </div>
        <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 32, alignItems: 'center', height: 'calc(100% - 64px)' }}>
          <GLHeroPanel
            title="ISSUE"
            sub="ed25519 · scope · expiry"
            body={(
              <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkSoft, lineHeight: 1.85 }}>
                <div><span style={{ color: GL.primary }}>"uid"</span>: <span style={{ color: GL.accent }}>"8F22A"</span></div>
                <div><span style={{ color: GL.primary }}>"issuer"</span>: <span style={{ color: GL.accent }}>"anthrocopter"</span></div>
                <div><span style={{ color: GL.primary }}>"scope"</span>: <span style={{ color: GL.accent }}>"payments:write"</span></div>
                <div><span style={{ color: GL.primary }}>"max"</span>: <span style={{ color: GL.accent }}>"$5k/d"</span></div>
              </div>
            )}
          />

          {/* Center identity orbit */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <PXIdentityOrbit
              size={300}
              palette="glass"
              nucleus="AGENT"
              subline="aps://8F22A"
              labels={[]}
            />
          </div>

          <GLHeroPanel
            title="VERIFY"
            sub="0.3–1.1 ms verdict"
            body={(
              <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkSoft, lineHeight: 1.85 }}>
                <div>→ dns issuer · <span style={{ color: GL.mint }}>found</span></div>
                <div>→ signature · <span style={{ color: GL.mint }}>valid</span></div>
                <div>→ revocation · <span style={{ color: GL.mint }}>clean</span></div>
                <div style={{ marginTop: 6, color: GL.mint, fontWeight: 600 }}>✓ ALLOW · 822µs</div>
              </div>
            )}
          />
        </div>
      </PXTranslucentCard>

      {/* Front layer — floating credential chip */}
      <div style={{ position: 'absolute', left: -10, bottom: -20 }}>
        <PXTranslucentCard hue="lavender" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <PXLogo size={28} color1={GL.accent} color2={GL.primary} />
          <div>
            <div style={{ fontFamily: PX.mono, fontSize: 9, color: PX.inkDim, letterSpacing: '0.2em' }}>KYA · CREDENTIAL</div>
            <div style={{ fontFamily: PX.sansDisplay, fontSize: 18, fontWeight: 600, color: PX.ink, letterSpacing: '0.04em', marginTop: 2 }}>ANTHROCOPTER · TREASURY</div>
          </div>
        </PXTranslucentCard>
      </div>
      <div style={{ position: 'absolute', right: 0, top: -10 }}>
        <PXTranslucentCard hue="blue" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <PXBreathingDot color={GL.primary} size={8} />
          <span style={{ fontFamily: PX.mono, fontSize: 10, color: PX.ink, letterSpacing: '0.2em', fontWeight: 600 }}>VERIFIED · 0.8 ms</span>
        </PXTranslucentCard>
      </div>
    </div>
  );
}

function GLHeroPanel({ title, sub, body }) {
  return (
    <div style={{ borderRadius: 18, background: PX.white, border: `1px solid ${PX.border}`, padding: '20px 22px', boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{ fontFamily: PX.sansDisplay, fontSize: 16, fontWeight: 600, color: PX.ink, letterSpacing: '0.12em' }}>{title}</span>
        <span style={{ fontFamily: PX.mono, fontSize: 9, color: PX.inkFaint, letterSpacing: '0.2em' }}>{sub}</span>
      </div>
      {body}
    </div>
  );
}

// ── Trust strip ──────────────────────────────────────────────
function GLTrust() {
  const logos = ['Microsoft', 'Stripe', 'Coinbase', 'Visa', 'x402', 'A2A', 'ACP', 'ERC-8004'];
  return (
    <div style={{ padding: '40px 64px', borderTop: `1px solid ${PX.border}`, borderBottom: `1px solid ${PX.border}`, background: PX.white }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <span style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkFaint, letterSpacing: '0.24em', whiteSpace: 'nowrap' }}>· INTEROPERATES WITH ·</span>
        {logos.map(l => (
          <span key={l} style={{ fontFamily: PX.sansDisplay, fontSize: 22, fontWeight: 500, color: PX.inkSoft, letterSpacing: '0.04em', opacity: 0.75 }}>{l.toUpperCase()}</span>
        ))}
      </div>
    </div>
  );
}

// ── The Passport ──────────────────────────────────────────────
function GLPassport() {
  return (
    <PXGradientBg variant="soft" grid={false}>
      <div style={{ padding: '160px 64px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 100, alignItems: 'center' }}>
          {/* Left: passport card */}
          <GLPassportCard />

          {/* Right: copy */}
          <div>
            <div style={{ marginBottom: 24 }}><PXSpec n="01" k="The Passport" /></div>
            <h2 style={{ fontFamily: PX.sansDisplay, fontSize: 88, fontWeight: 400, lineHeight: 0.95, letterSpacing: '0.005em', color: PX.ink, margin: 0 }}>
              A signed<br />
              <span style={{ color: GL.primary }}>credential</span> for every<br />
              autonomous actor.
            </h2>
            <p style={{ fontFamily: PX.sans, fontSize: 18, lineHeight: 1.6, color: PX.inkSoft, margin: '36px 0 0', maxWidth: 500, fontWeight: 400 }}>
              Each Agent Passport is a portable, cryptographically signed credential. It answers
              the four questions every counterparty must ask of any autonomous actor &mdash; and
              travels with the agent across the network.
            </p>
            <div style={{ marginTop: 48 }}>
              {[
                ['Who is it?', 'Cryptographic UID bound to a DNS-verified issuer.'],
                ['Who owns it?', 'A legal entity of record — with on-file KYC if regulated.'],
                ['What can it do?', 'Fine-grained scope: rate, geography, value cap, time-window.'],
                ['What did it do?', 'Tamper-evident log of every verification call.'],
              ].map(([q, a], i) => (
                <div key={q} style={{ display: 'grid', gridTemplateColumns: '32px 200px 1fr', gap: 16, padding: '20px 0', borderBottom: `1px solid ${PX.border}` }}>
                  <span style={{ fontFamily: PX.mono, fontSize: 11, color: GL.primary, letterSpacing: '0.18em', paddingTop: 2 }}>0{i + 1}</span>
                  <span style={{ fontFamily: PX.sansDisplay, fontSize: 22, fontWeight: 500, color: PX.ink, letterSpacing: '0.005em' }}>{q}</span>
                  <span style={{ fontFamily: PX.sans, fontSize: 15, color: PX.inkSoft, lineHeight: 1.6 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PXGradientBg>
  );
}

function GLPassportCard() {
  return (
    <div style={{ position: 'relative', perspective: '1500px' }}>
      {/* Bigger stack — 4 layers for depth */}
        <div data-kya-passport-stack style={{ position: 'absolute', top: 20, left: 22, right: -16, bottom: -16, background: 'rgba(240,247,250,0.45)', border: `1px solid ${PX.border}`, borderRadius: 26, transform: 'rotate(3deg) translateZ(-30px)' }} />
      <div data-kya-passport-stack style={{ position: 'absolute', top: 10, left: 10, right: -8, bottom: -8, background: 'rgba(255,255,255,0.7)', border: `1px solid ${PX.border}`, borderRadius: 26, transform: 'rotate(1.5deg) translateZ(-15px)' }} />

      <PXTranslucentCard data-kya-passport-card hue="cyan" style={{ position: 'relative', padding: 32, transform: 'rotate(-0.8deg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkDim, letterSpacing: '0.24em' }}>MODEL CITIZEN · AGENT PASSPORT</div>
            <div style={{ fontFamily: PX.sansDisplay, fontSize: 30, fontWeight: 500, color: PX.ink, marginTop: 4, letterSpacing: '0.01em' }}>Anthrocopter Treasury</div>
            <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkSoft, marginTop: 2 }}>aps://8F22A · v1.0</div>
          </div>
          <PXLogo size={48} color1={GL.primary} color2={GL.accent} />
        </div>

        <div data-kya-passport-grid style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '110px 1fr', gap: 24 }}>
          <div data-kya-passport-photo style={{ width: 110, height: 138, borderRadius: 12, background: `linear-gradient(160deg, ${PX.paperCyan}, ${PX.paperBlue})`, border: `1px solid ${PX.border}`, position: 'relative', overflow: 'hidden' }}>
            <svg width="110" height="138" viewBox="0 0 110 138">
              {Array.from({ length: 12 }).map((_, i) => (
                <circle key={i} cx={(i * 37 + 23) % 110} cy={(i * 53 + 17) % 138} r={(i % 3) + 1} fill={i % 2 ? GL.accent : GL.primary} opacity={0.45} />
              ))}
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i * 79) % 12; const b = ((i + 1) * 53) % 12;
                return <line key={i} x1={(a * 37 + 23) % 110} y1={(a * 53 + 17) % 138} x2={(b * 37 + 23) % 110} y2={(b * 53 + 17) % 138} stroke={GL.primary} strokeWidth="0.4" strokeOpacity="0.4" />;
              })}
            </svg>
            <div style={{ position: 'absolute', bottom: 8, left: 8, fontFamily: PX.mono, fontSize: 8, color: PX.inkSoft, letterSpacing: '0.16em' }}>UID·8F22A</div>
          </div>
          <div style={{ fontFamily: PX.mono, fontSize: 11, lineHeight: 2 }}>
            <GLPRow k="ISSUER" v="anthrocopter.com" />
            <GLPRow k="MODEL" v="claude-sonnet-4.5 · v2026.05" />
            <GLPRow k="OWNER" v="Stripe Treasury, Inc. · US-DE" />
            <GLPRow k="KYC" v="KYC-3F2A9B71 · on file" />
            <GLPRow k="SCOPE" v="payments:write ≤ $5k / day" />
            <GLPRow k="ISSUED" v={`${kyaToday()} · 14:08 UTC`} />
            <GLPRow k="EXPIRES" v={kyaPlusDays(180)} />
          </div>
        </div>

        <div data-kya-mrz style={{ marginTop: 24, paddingTop: 16, borderTop: `1px dashed ${PX.border}`, fontFamily: PX.mono, fontSize: 10.5, color: PX.inkSoft, letterSpacing: '0.14em', lineHeight: 1.8 }}>
          APS&lt;&lt;8F22A&lt;ANTHROCOPTER&lt;TREASURY&lt;BOT&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
          ED25519&lt;3F2A&lt;9B71&lt;C8E4&lt;55D0&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;OK&lt;&lt;&lt;
        </div>

        <div data-kya-verified-stamp style={{ position: 'absolute', top: -18, right: -22, transform: 'rotate(8deg)' }}>
          <div style={{ border: `1.5px solid ${GL.primary}`, padding: '8px 14px', borderRadius: 8, background: PX.white, fontFamily: PX.mono, fontSize: 11, color: GL.primary, fontWeight: 600, letterSpacing: '0.22em', textAlign: 'center', lineHeight: 1.3 }}>
            VERIFIED<br />{kyaToday()}
          </div>
        </div>
      </PXTranslucentCard>
    </div>
  );
}

function GLPRow({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr', gap: 12, borderBottom: `1px dotted ${PX.borderSoft}` }}>
      <span style={{ color: PX.inkFaint, letterSpacing: '0.14em' }}>{k}</span>
      <span style={{ color: PX.inkSoft }}>{v}</span>
    </div>
  );
}

Object.assign(window, {
  GL, GLNav, GLHero, GLHeroPlate, GLHeroPanel, GLTrust,
  GLPassport, GLPassportCard, GLPRow,
});
