// KYA / AEOESS — Resources pages: Open Source, Pilot, Blog, FAQ, Compare.

// ─────────────────────────────────────────────────────
// OpenSourcePage
// ─────────────────────────────────────────────────────
function OpenSourcePage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="OPEN SOURCE · APACHE 2.0"
        title="Built in the open."
        titleAccent="By design."
        lede="KYA is the managed face of the Agent Passport System — an Apache 2.0 protocol with SDKs in TypeScript and Python, byte-parity-verified across implementations. Self-host the gateway free. Forever."
        ctas={['View on GitHub →', 'Read the spec']}
        right={(
          <PXTranslucentCard hue="cyan" style={{ padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                ['22,323', 'installs'],
                ['2,884', 'SDK tests passing'],
                ['110', 'protocol modules'],
                ['8', 'research papers'],
              ].map(([v, k]) => (
                <div key={k}>
                  <div style={{ fontFamily: PX.sansDisplay, fontSize: 44, fontWeight: 500, color: PX.ink, letterSpacing: '0.005em', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: PX.mono, fontSize: 10, color: PX.inkFaint, letterSpacing: '0.2em', marginTop: 6 }}>{k.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${PX.border}`, fontFamily: PX.mono, fontSize: 12, color: PX.inkSoft }}>
              <div><span style={{ color: GL.primary }}>$</span> npm install agent-passport-system</div>
              <div style={{ marginTop: 4 }}><span style={{ color: GL.primary }}>$</span> pip install agent-passport-system</div>
            </div>
          </PXTranslucentCard>
        )}
      />

      <PageBody variant="soft">
        <SectionHead n="01" k="What's in the box" title={<>The whole <span style={{ color: GL.primary }}>protocol stack.</span></>} />
        <FeatureGrid cols={3} items={[
          { badge: 'SDK · TYPESCRIPT', title: 'agent-passport-system', body: 'npm. Browser, Node, Workers, Deno. Zero-dep crypto via WebCrypto.', tags: ['1,247 tests', 'tree-shakable'], hue: 'cyan' },
          { badge: 'SDK · PYTHON', title: 'agent-passport-system', body: 'pip. CPython 3.10+. Receipts byte-parity with TS.', tags: ['1,637 tests', 'mypy clean'], hue: 'blue' },
          { badge: 'GATEWAY', title: 'kya-gateway', body: 'Single binary. Docker, Helm, or bare-metal. Run anywhere requests live.', tags: ['Rust core', 'Apache 2.0'], hue: 'lavender' },
          { badge: 'CLI', title: 'kya', body: 'Issue, delegate, verify, audit — from the shell.', tags: ['scripted', 'offline-capable'], hue: 'cyan' },
          { badge: 'MCP', title: 'kya-mcp', body: 'Model Context Protocol server. Plug KYA into any MCP-aware host.', tags: ['claude-desktop', 'cursor'], hue: 'blue' },
          { badge: 'SPEC', title: 'agent-passport.org', body: 'The public specification. IETF Internet-Draft, RFC 8785 JCS receipts.', tags: ['draft-01', 'machine-readable'], hue: 'lavender' },
        ]} />
      </PageBody>

      <PageBody variant="glass" grid={true}>
        <SectionHead n="02" k="Contribute" title={<>The protocol lives at <span style={{ color: GL.primary }}>agent-passport.org</span>.</>} lede="Specification, RFCs, conformance suite, and issue tracker are all in the open. Apache 2.0. Pull requests and discussions welcome." />
        <PXTranslucentCard hue="cyan" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontFamily: PX.mono, fontSize: 11, color: PX.inkSoft, letterSpacing: '0.18em', lineHeight: 2.2 }}>
            <div>SPECIFICATION &nbsp;·&nbsp; <a href="https://agent-passport.org" target="_blank" rel="noopener" style={{ color: GL.primary, fontWeight: 600 }}>agent-passport.org</a></div>
            <div>SOURCE &nbsp;·&nbsp; <a href="https://github.com/aeoess" target="_blank" rel="noopener" style={{ color: GL.primary, fontWeight: 600 }}>github.com/aeoess</a></div>
          </div>
        </PXTranslucentCard>
      </PageBody>

      <PageCTA
        title="Build with us"
        accent="in the open."
        primary="View on GitHub →"
        secondary="Read the spec"
        onPrimary={() => window.open('https://github.com/aeoess', '_blank', 'noopener')}
        onSecondary={() => window.open('https://agent-passport.org', '_blank', 'noopener')}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────
// PricingPage
// ─────────────────────────────────────────────────────
function PricingPage({ onNavigate }) {
  React.useEffect(() => { window.location.href = '/model-citizen/'; }, []);
  return null;
}

Object.assign(window, { OpenSourcePage, PricingPage });
