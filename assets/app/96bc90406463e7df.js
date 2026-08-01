// KYA / AEOESS — page content. Part 1.
// Pages: Home (Glass landing reused), Protocol, Payments, Content, Compliance, Enterprise.

// ─────────────────────────────────────────────────────
// HomePage — uses the existing GlassLanding sections but
// wrapped with SiteNav/SiteFooter via PageShell.
// We render the full Glass landing inside a route, but
// suppress its own nav and footer (the page shell handles those).
// ─────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  return (
    <>
      <GLHero />
      <GLTrust />
      <GLPassport />
      <GLProtocol />
      <GLVerifyDemo />
      <GLDevelopers />
      <GLEnterprise />
      <GLUseCases />
      <PageCTA
        title="Agents are already in production."
        accent="Govern them like it."
        lede="Access through the Model Citizen pilot, by application."
        primary="See the pilot →"
        secondary="Talk to engineering"
        onPrimary={() => onNavigate('pricing')}
        onSecondary={() => onNavigate('contact')}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────
// ProtocolPage — the four primitives, architecture, standards
// ─────────────────────────────────────────────────────
function ProtocolPage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="AGENT PASSPORT SYSTEM · v1.0"
        title="Four primitives."
        titleAccent="One trust fabric."
        lede="Every APS interaction composes the same four cryptographic moves. They run wherever your agent runs — edge, cloud, on-device. Open protocol, Apache 2.0."
        ctas={['Read the spec →', 'Browse on GitHub']}
        right={(
          <PXTranslucentCard hue="cyan" style={{ padding: 32 }}>
            <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkDim, letterSpacing: '0.22em', marginBottom: 14 }}>LIVE TRACE · last 60s</div>
            <div style={{ fontFamily: PX.mono, fontSize: 12, color: PX.inkSoft, lineHeight: 1.9 }}>
              <div>→ <span style={{ color: GL.primary }}>ISSUE</span> &nbsp; did:aps:0xA1F…3c2e &nbsp; <span style={{ color: PX.inkFaint }}>14:08:21</span></div>
              <div>→ <span style={{ color: GL.accent }}>DELEGATE</span> &nbsp; scope: write:stripe ≤ $5k/d</div>
              <div>→ <span style={{ color: GL.mint }}>ENFORCE</span> &nbsp; allow · 0.8 ms · 5-gate pass</div>
              <div>→ <span style={{ color: GL.primary }}>RECEIPT</span> &nbsp; ed25519:7f2c… · sha-256</div>
            </div>
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${PX.border}`, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkFaint, letterSpacing: '0.2em' }}>P50 EVAL</div>
                <div style={{ fontFamily: PX.sansDisplay, fontSize: 32, fontWeight: 500, color: PX.ink, letterSpacing: '0.005em' }}>0.8 ms</div>
              </div>
              <div>
                <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkFaint, letterSpacing: '0.2em' }}>THROUGHPUT</div>
                <div style={{ fontFamily: PX.sansDisplay, fontSize: 32, fontWeight: 500, color: PX.ink, letterSpacing: '0.005em' }}>16–36 M ops/sec</div>
              </div>
            </div>
          </PXTranslucentCard>
        )}
      />

      {/* The four primitives */}
      <PageBody variant="soft">
        <SectionHead n="01" k="The Protocol" title={<>Four cryptographic moves.<br /><span style={{ color: GL.primary }}>Composable. Verifiable.</span></>} />
        <FeatureGrid cols={2} items={[
          { badge: '01 · ISSUE', title: 'Identity', body: 'A passport is a DID anchored to a key the agent or its operator holds. No central registry. No PII required.', tags: ['ed25519', 'did:key · did:web · did:aps', 'wallet-bound'], hue: 'cyan' },
          { badge: '02 · DELEGATE', title: 'Delegation', body: 'The operator hands the agent a scoped capability: what, when, where, how much. Signed. Composable. Revocable.', tags: ['scope', 'ttl', 'budget', 'attest'], hue: 'blue' },
          { badge: '03 · ENFORCE', title: 'Enforcement', body: 'The gateway evaluates the passport, the delegation, and the call. 0.8 ms p50 against the full enforcement stack. Deterministic, audit-deniable on every refuse.', tags: ['signature', 'scope', 'spend', 'freshness', 'revocation'], hue: 'lavender' },
          { badge: '04 · RECEIPT', title: 'Receipt', body: 'Every action emits a signed receipt: what, who, when, what was decided. Tamper-evident. Independently verifiable.', tags: ['RFC 8785 JCS', 'ed25519', 'sha-256'], hue: 'cyan' },
        ]} />
      </PageBody>

      {/* Architecture */}
      <PageBody variant="glass" grid={true}>
        <SectionHead n="02" k="Architecture" title={<>One endpoint. <span style={{ color: GL.primary }}>Every agent action</span> governed.</>} lede="Point your model traffic at gateway.aeoess.com. Identity, delegation, enforcement, and receipts on every call. Self-host free under Apache 2.0, or use the managed tier." />
        <PXTranslucentCard hue="cyan" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 32, alignItems: 'center' }}>
            <ArchNode title="AGENT" sub="claude · gpt · llama" detail="signs request" />
            <div style={{ position: 'relative', height: 220 }}>
              <ArchGateway />
            </div>
            <ArchNode title="WORLD" sub="apis · payments · data" detail="receives action" />
          </div>
        </PXTranslucentCard>
      </PageBody>

      {/* Standards */}
      <PageBody variant="soft">
        <SectionHead n="03" k="Standards" title={<>Read in the <span style={{ color: GL.primary }}>right rooms.</span></>} lede="APS is a public protocol. An IETF Internet-Draft, two NIST federal-record submissions, eight Zenodo-indexed research papers, and cross-implementation byte-parity with peer registries." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            ['IETF', 'draft-pidlisnyi-aps-01', 'Internet-Draft. Individual submission, idnits clean.', 'datatracker.ietf.org'],
            ['NIST · CAISI', 'AI 800-2 input', 'Acknowledged in writing by the program lead.', 'nist.gov'],
            ['NIST · NCCoE', 'AI Agent Identity & Auth', 'Public comments filed on the concept paper.', 'nccoe.nist.gov'],
            ['W3C', 'CG threads · DID', 'Active in did-method discussions and verifiable credentials WG.', 'w3.org'],
            ['OWASP', 'AIVSS', 'Contributing to the AI Vulnerability Scoring System.', 'owasp.org'],
            ['Industry', 'ACP · A2A · ERC-8004', 'Receipts compose with the commerce primitives the agent economy is settling on.', 'aeoess.com'],
          ].map(([k, t, body, host], i) => (
            <PXTranslucentCard key={k} hue={i % 2 ? 'lavender' : 'blue'} style={{ padding: 24 }}>
              <div style={{ fontFamily: PX.mono, fontSize: 10, color: GL.primary, letterSpacing: '0.22em', fontWeight: 600 }}>{k}</div>
              <div style={{ fontFamily: PX.sansDisplay, fontSize: 22, fontWeight: 500, color: PX.ink, marginTop: 6, letterSpacing: '0.005em' }}>{t}</div>
              <p style={{ fontFamily: PX.sans, fontSize: 14, color: PX.inkSoft, marginTop: 10, lineHeight: 1.55, marginBottom: 0 }}>{body}</p>
              <div style={{ marginTop: 14, fontFamily: PX.mono, fontSize: 11, color: PX.inkFaint, letterSpacing: '0.1em' }}>{host} →</div>
            </PXTranslucentCard>
          ))}
        </div>
      </PageBody>

      <PageCTA
        title="Build on the"
        accent="open protocol."
        lede="Apache 2.0. SDKs in TypeScript and Python. Production-ready, byte-parity-verified."
        primary="View on GitHub →"
        secondary="Read the spec"
        onPrimary={() => onNavigate('opensource')}
        onSecondary={() => onNavigate('protocol')}
      />
    </>
  );
}

function ArchNode({ title, sub, detail }) {
  return (
    <div style={{ background: PX.white, border: `1px solid ${PX.border}`, borderRadius: 18, padding: '24px 26px', textAlign: 'center', boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset' }}>
      <div style={{ fontFamily: PX.sansDisplay, fontSize: 22, fontWeight: 600, letterSpacing: '0.08em', color: PX.ink }}>{title}</div>
      <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkDim, letterSpacing: '0.14em', marginTop: 6 }}>{sub}</div>
      <div style={{ fontFamily: PX.sans, fontStyle: 'italic', fontSize: 13, color: PX.inkSoft, marginTop: 14 }}>{detail}</div>
    </div>
  );
}

function ArchGateway() {
  return (
    <svg viewBox="0 0 400 220" width="100%" height="220">
      <defs>
        <linearGradient id="arch-flow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={GL.primary} stopOpacity="0.3" />
          <stop offset="0.5" stopColor={GL.primary} stopOpacity="1" />
          <stop offset="1" stopColor={GL.primary} stopOpacity="0.3" />
        </linearGradient>
        <marker id="arch-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={GL.primary} />
        </marker>
      </defs>
      {/* Gateway box */}
      <rect x="100" y="60" width="200" height="100" rx="14" fill={PX.white} stroke={GL.primary} strokeWidth="1.5" />
      <text x="200" y="86" fontFamily={PX.mono} fontSize="10" fill={PX.inkDim} textAnchor="middle" letterSpacing="0.22em">AEOESS · GATEWAY</text>
      <text x="200" y="116" fontFamily={PX.sansDisplay} fontSize="22" fontWeight="600" fill={PX.ink} textAnchor="middle" letterSpacing="0.04em">ENFORCE</text>
      <text x="200" y="136" fontFamily={PX.mono} fontSize="9" fill={PX.inkFaint} textAnchor="middle" letterSpacing="0.14em">0.8 ms · 5-GATE</text>

      {/* Lines in/out */}
      <line x1="0" y1="110" x2="100" y2="110" stroke="url(#arch-flow)" strokeWidth="1.2" markerEnd="url(#arch-arr)" />
      <line x1="300" y1="110" x2="400" y2="110" stroke="url(#arch-flow)" strokeWidth="1.2" markerEnd="url(#arch-arr)" />
      <circle r="3" fill={GL.primary}>
        <animate attributeName="cx" from="0" to="100" dur="2s" repeatCount="indefinite" />
        <animate attributeName="cy" from="110" to="110" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill={GL.primary}>
        <animate attributeName="cx" from="300" to="400" dur="2s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="cy" from="110" to="110" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      {/* Receipt drop */}
      <path d="M 200 160 L 200 200" stroke={GL.accent} strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arch-arr)" />
      <text x="208" y="195" fontFamily={PX.mono} fontSize="9" fill={GL.accent} letterSpacing="0.14em">RECEIPT → AUDIT LOG</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────
// PaymentsPage
// ─────────────────────────────────────────────────────
function PaymentsPage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="SOLUTIONS · PAYMENTS"
        title="Agents that can spend money"
        titleAccent="without spending yours."
        lede="Per-call budgets, merchant allow-lists, a four-gate spending policy. Signed payment receipts at the protocol layer that compose with ACP, A2A, and ERC-8004 commerce primitives."
        ctas={['Join the pilot →', 'Read the protocol']}
        right={(
          <PXTranslucentCard hue="cyan" style={{ padding: 28 }}>
            <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkDim, letterSpacing: '0.22em', marginBottom: 14 }}>PREFLIGHT · 5 GATES</div>
            {[
              ['SIGNATURE', 'ed25519 · valid', 'pass'],
              ['SCOPE', 'write:stripe', 'pass'],
              ['SPEND', '$250 ≤ $5k/d', 'pass'],
              ['FRESHNESS', '< 60s', 'pass'],
              ['REVOCATION', 'clean', 'pass'],
            ].map(([k, v, st]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: 12, padding: '12px 0', borderBottom: `1px dotted ${PX.borderSoft}`, alignItems: 'center' }}>
                <span style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkFaint, letterSpacing: '0.18em' }}>{k}</span>
                <span style={{ fontFamily: PX.mono, fontSize: 12, color: PX.ink }}>{v}</span>
                <span style={{ fontFamily: PX.mono, fontSize: 9, color: GL.mint, letterSpacing: '0.2em', fontWeight: 700 }}>✓ {st.toUpperCase()}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, padding: '12px 16px', borderRadius: 12, background: 'rgba(125,201,176,0.14)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: PX.mono, fontSize: 11, color: GL.mint, letterSpacing: '0.18em', fontWeight: 600 }}>ALLOW · RECEIPT EMITTED</span>
              <span style={{ fontFamily: PX.mono, fontSize: 11, color: GL.mint, fontWeight: 600 }}>0.8 ms</span>
            </div>
          </PXTranslucentCard>
        )}
      />

      <PageBody variant="soft">
        <SectionHead n="01" k="Four-gate spending" title={<>Bind a key to a budget. <span style={{ color: GL.primary }}>Period.</span></>} lede="Every payment a passport-bound agent attempts is intercepted, evaluated, and either signed or refused — deterministically — before it touches the rails." />
        <FeatureGrid cols={3} items={[
          { badge: 'BUDGETS', title: 'Per-agent, per-call, per-day.', body: 'Cap any axis. $5k/day, $250/call, $50k/month. The gateway enforces before the merchant ever sees the request.', hue: 'cyan' },
          { badge: 'ALLOW-LISTS', title: 'Merchants the agent may pay.', body: 'Whitelist counterparties by domain, BIN, or MCC. Out-of-list = refused with a signed denial receipt.', hue: 'blue' },
          { badge: 'COMPOSABLE', title: 'ACP · A2A · ERC-8004.', body: 'APS receipts compose with the commerce primitives the agent economy is settling on, on-chain and off.', hue: 'lavender' },
        ]} />
      </PageBody>

      <PageBody variant="glass" grid={true}>
        <SectionHead n="02" k="Why it matters" title={<>Cards weren't built for <span style={{ color: GL.primary }}>autonomous spenders.</span></>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <PXTranslucentCard hue="lavender" style={{ padding: 28 }}>
            <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkFaint, letterSpacing: '0.22em' }}>TODAY · WITHOUT APS</div>
            <div style={{ fontFamily: PX.sansDisplay, fontSize: 28, fontWeight: 500, color: PX.ink, marginTop: 6 }}>Cards. Hope. Chargebacks.</div>
            <ul style={{ fontFamily: PX.sans, fontSize: 15, lineHeight: 1.7, color: PX.inkSoft, marginTop: 18, paddingLeft: 18 }}>
              <li>Agent identity = an API key in a wiki.</li>
              <li>Spending cap = a system prompt that says "please don't."</li>
              <li>Audit = grep the Stripe dashboard at 3 a.m.</li>
              <li>Revocation = a Jira ticket, a deploy, and a prayer.</li>
              <li>Disputes = the chargeback shows up Tuesday.</li>
            </ul>
          </PXTranslucentCard>
          <PXTranslucentCard hue="cyan" style={{ padding: 28 }}>
            <div style={{ fontFamily: PX.mono, fontSize: 10, color: GL.primary, letterSpacing: '0.22em', fontWeight: 600 }}>WITH APS</div>
            <div style={{ fontFamily: PX.sansDisplay, fontSize: 28, fontWeight: 500, color: PX.ink, marginTop: 6 }}>Keys. Caps. Receipts.</div>
            <ul style={{ fontFamily: PX.sans, fontSize: 15, lineHeight: 1.7, color: PX.inkSoft, marginTop: 18, paddingLeft: 18 }}>
              <li>Every agent has a key. Every key has a name. Every name has an owner.</li>
              <li>Capabilities are cryptographic. Out-of-scope = won't sign.</li>
              <li>One signed log per tenant. Verifiable byte-for-byte.</li>
              <li>Revoke a key, the next call denies. Cascade through delegations.</li>
              <li>Receipts your auditor, your bank, and your regulator can verify.</li>
            </ul>
          </PXTranslucentCard>
        </div>
      </PageBody>

      <PageCTA
        title="Spend with"
        accent="proof."
        primary="Join the pilot →"
        secondary="Talk to engineering"
        onPrimary={() => onNavigate('pricing')}
        onSecondary={() => onNavigate('contact')}
      />
    </>
  );
}

Object.assign(window, { HomePage, ProtocolPage, PaymentsPage, ArchNode, ArchGateway });
