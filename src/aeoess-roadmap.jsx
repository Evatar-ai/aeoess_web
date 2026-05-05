// aeoess-roadmap.jsx, Faithful rebuild of aeoess.com/roadmap.html
// Same structure as the live site (YAML-driven horizontal Gantt, swimlanes
// per workstream, status legend, dependency arrows). Restyled in the
// Restrained design language: hairline rules, single accent, calm rhythm.

const { AeoessMark, NavDropdown, NavDropdownResources, Footer, SectionEyebrow,
        navLink, primaryBtn, secondaryBtn, SubHeader } = window;

// ── Roadmap data (subset of the live YAML, every field preserved) ──
const ROADMAP = [
  // PROTOCOL
  { id:'project-begins',          title:'Project Begins',                       w:'protocol', s:'done',    d0:1,  d1:2,  deps:[] },
  { id:'mcp-server',               title:'MCP Server + Agora Seeded',            w:'protocol', s:'done',    d0:6,  d1:7,  deps:['project-begins'] },
  { id:'intent-arch',              title:'Layer 5: Intent Architecture',         w:'protocol', s:'done',    d0:8,  d1:8,  deps:['mcp-server'] },
  { id:'coordination',             title:'Layer 7: Coordination Primitives',     w:'protocol', s:'done',    d0:10, d1:10, deps:['intent-arch'] },
  { id:'agentic-commerce',         title:'Layer 8: Agentic Commerce + MCP v2.1', w:'protocol', s:'done',    d0:12, d1:12, deps:['coordination'] },
  { id:'graduated-enforcement',    title:'Graduated Enforcement + Threat Model', w:'protocol', s:'done',    d0:13, d1:13, deps:['agentic-commerce'] },
  { id:'first-audit',              title:'First Real Audit',                     w:'protocol', s:'done',    d0:14, d1:14, deps:['graduated-enforcement'] },
  { id:'principal-identity',       title:'Principal Identity + Python SDK',      w:'protocol', s:'done',    d0:17, d1:17, deps:['first-audit'] },
  { id:'did-vc',                   title:'W3C DID + Verifiable Credentials',     w:'protocol', s:'done',    d0:17, d1:17, deps:['principal-identity'] },
  { id:'a2a-bridge',                title:'A2A Protocol Bridge',                  w:'protocol', s:'done',    d0:17, d1:17, deps:['principal-identity'] },
  { id:'reputation-gates',         title:'Reputation-Gated Authority',           w:'protocol', s:'done',    d0:21, d1:21, deps:['principal-identity'] },
  { id:'proxy-gateway',            title:'ProxyGateway Enforcement Boundary',    w:'protocol', s:'done',    d0:22, d1:22, deps:['reputation-gates'] },
  { id:'encrypted-msg',            title:'Module 19: E2E Encrypted Messaging',   w:'protocol', s:'done',    d0:30, d1:30, deps:['reputation-gates'] },
  { id:'thirty-modules',            title:'30 Constitutional Modules',            w:'protocol', s:'done',    d0:34, d1:34, deps:['encrypted-msg'] },
  { id:'institutional',            title:'Institutional Governance Layer',    w:'protocol', s:'done',    d0:38, d1:38, deps:['thirty-modules'] },
  { id:'gateway-wiring',           title:'Gateway Wiring (20% → 79%)',           w:'protocol', s:'done',    d0:40, d1:40, deps:['institutional'] },
  { id:'agent-wallets',            title:'Agent Wallets',                        w:'protocol', s:'done',    d0:41, d1:41, deps:['gateway-wiring'] },
  { id:'attestation',              title:'Agent Attestation Architecture',       w:'protocol', s:'done',    d0:42, d1:42, deps:['agent-wallets'] },
  { id:'byoi',                     title:'Bring Your Own Identity',              w:'protocol', s:'done',    d0:46, d1:46, deps:['attestation'] },
  { id:'twelve-primitives',        title:'Twelve Primitives in One Day',         w:'protocol', s:'done',    d0:49, d1:49, deps:['byoi'] },
  { id:'three-walls',              title:'SDK /core + MCP Essential',            w:'protocol', s:'done',    d0:52, d1:52, deps:['twelve-primitives'] },
  { id:'vocab-repo',               title:'Vocabulary Repo Launched',             w:'protocol', s:'done',    d0:53, d1:53, deps:['three-walls'] },
  { id:'build-a-attribution',      title:'Build A: Attribution Primitive',       w:'protocol', s:'done',    d0:56, d1:59, deps:['vocab-repo'] },
  { id:'build-b-fractional',       title:'Build B: Fractional Weights',          w:'protocol', s:'done',    d0:59, d1:59, deps:['build-a-attribution'] },
  { id:'build-c-settlement',       title:'Build C: Settlement Pipeline',         w:'protocol', s:'done',    d0:60, d1:60, deps:['build-b-fractional'] },
  { id:'build-h-pq',               title:'Build H: Post-Quantum Sigs',           w:'protocol', s:'backlog', d0:80, d1:90, deps:['build-a-attribution'] },

  // PRODUCT
  { id:'intent-network',           title:'Intent Network',                       w:'product',  s:'done',    d0:22, d1:22, deps:['reputation-gates'] },
  { id:'mingle-v1',                title:'Mingle v1',                            w:'product',  s:'done',    d0:23, d1:23, deps:['intent-network'] },
  { id:'mingle-v2',                title:'Mingle v2: Semantic + Ghost',          w:'product',  s:'done',    d0:26, d1:26, deps:['mingle-v1'] },
  { id:'governance-distribution',  title:'Governance Distribution Stack',        w:'product',  s:'done',    d0:37, d1:37, deps:['thirty-modules'] },
  { id:'gateway-prod',             title:'Gateway on Railway',                   w:'product',  s:'done',    d0:40, d1:41, deps:['institutional'] },
  { id:'customer-gateway',         title:'Customer-Ready Gateway',               w:'product',  s:'done',    d0:50, d1:50, deps:['twelve-primitives'] },
  { id:'marketplace-proposal',     title:'Marketplace Proposal',                 w:'product',  s:'active',  d0:55, d1:55, deps:['attribution-spec'] },
  { id:'build-d-enterprise',       title:'Build D: Gateway Enterprise',          w:'product',  s:'backlog', d0:70, d1:85, deps:['build-c-settlement'] },
  { id:'build-e-converged',        title:'Build E: Converged Orchestrator',      w:'product',  s:'backlog', d0:75, d1:90, deps:['build-a-attribution'] },

  // RESEARCH
  { id:'paper-1',                  title:'Paper 1: Agent Social Contract',       w:'research', s:'done',    d0:4,  d1:5,  deps:['project-begins'] },
  { id:'threat-model',             title:'Threat Model Published',               w:'research', s:'done',    d0:13, d1:13, deps:['paper-1'] },
  { id:'eu-ai-act',                title:'EU AI Act Compliance Mapping',         w:'research', s:'done',    d0:17, d1:17, deps:['threat-model'] },
  { id:'paper-2',                  title:'Paper 2: Monotonic Narrowing',         w:'research', s:'done',    d0:20, d1:20, deps:['eu-ai-act'] },
  { id:'cross-protocol',           title:'Cross-Protocol Envelope Spec',         w:'research', s:'done',    d0:29, d1:29, deps:['paper-2'] },
  { id:'paper-3',                  title:'Paper 3: Faceted Authority',           w:'research', s:'done',    d0:39, d1:39, deps:['cross-protocol'] },
  { id:'paper-4',                  title:'Paper 4: Behavioral Derivation',       w:'research', s:'done',    d0:51, d1:51, deps:['paper-3'] },
  { id:'paper-5',                  title:'Paper 5: Physics-Enforced Delegation', w:'research', s:'done',    d0:51, d1:51, deps:['paper-3'] },
  { id:'attribution-spec',         title:'Attribution Primitive Spec',           w:'research', s:'done',    d0:54, d1:57, deps:['paper-5'] },
  { id:'paper-6-attribution',      title:'Attribution primitive paper',          w:'research', s:'backlog', d0:70, d1:90, deps:['attribution-spec'] },
  { id:'paper-7-oversight',        title:'Paper 8: Cross-Family Oversight',      w:'research', s:'backlog', d0:70, d1:90, deps:['attribution-spec'] },
  { id:'ietf-v2',                  title:'IETF Internet-Draft v2',               w:'research', s:'backlog', d0:80, d1:90, deps:['paper-6-attribution'] },

  // COMMS
  { id:'community-shows-up',       title:'The Community Shows Up',               w:'comms',    s:'done',    d0:4,  d1:5,  deps:[] },
  { id:'agora-signed-speech',      title:'Agora: Signed Speech for Agents',      w:'comms',    s:'done',    d0:11, d1:11, deps:['community-shows-up'] },
  { id:'substack-launch',          title:'Substack Launch',                      w:'comms',    s:'done',    d0:25, d1:25, deps:['agora-signed-speech'] },
  { id:'yc-endorsed',              title:'YC CEO Endorsed + Microsoft Merged',   w:'comms',    s:'done',    d0:28, d1:28, deps:['substack-launch'] },
  { id:'oatr',                     title:'Clean Slate + OATR Founding Member',   w:'comms',    s:'done',    d0:36, d1:36, deps:['yc-endorsed'] },
  { id:'wg-specs',                 title:'3 WG Specs Ratified',                  w:'comms',    s:'done',    d0:36, d1:36, deps:['oatr'] },
  { id:'solana-milestone',         title:'Solana Agent Kit Adoption',            w:'comms',    s:'done',    d0:44, d1:44, deps:['yc-endorsed'] },
  { id:'w3c-normative',            title:'W3C Behavioral Attestation Normative', w:'comms',    s:'done',    d0:47, d1:47, deps:['wg-specs'] },
  { id:'ecosystem-28',             title:'28 Active Ecosystem Threads',          w:'comms',    s:'done',    d0:53, d1:53, deps:['w3c-normative'] },
  { id:'a2a-1717',                 title:'A2A #1717: Cross-Verify Demo',         w:'comms',    s:'active',  d0:54, d1:57, deps:[] },
  { id:'a2a-1713',                 title:'A2A #1713: Dual-Signature',            w:'comms',    s:'backlog', d0:56, d1:58, deps:[] },

  // OPS
  { id:'agent-district',           title:'Agent District, Pixel-Art Map',       w:'ops',      s:'done',    d0:12, d1:13, deps:[] },
  { id:'website-overhaul',         title:'Website Overhaul + SEO Sprint',        w:'ops',      s:'done',    d0:13, d1:13, deps:[] },
  { id:'owasp',                    title:'OWASP AI Security Mapping',            w:'ops',      s:'done',    d0:16, d1:16, deps:[] },
  { id:'remote-mcp',               title:'Remote MCP Server Live',               w:'ops',      s:'done',    d0:17, d1:17, deps:[] },
  { id:'homepage-redesign',        title:'Homepage Redesign + FAQ',              w:'ops',      s:'done',    d0:21, d1:22, deps:['website-overhaul'] },
  { id:'amcs',                     title:'AMCS v0.1.0',                          w:'ops',      s:'done',    d0:32, d1:32, deps:[] },
  { id:'rebrand',                  title:'Rebrand: Governance for Agent Economy',w:'ops',      s:'done',    d0:39, d1:39, deps:[] },
  { id:'roadmap-iface',            title:'Public Roadmap',                       w:'ops',      s:'done',    d0:55, d1:55, deps:[] },
  { id:'yc-app',                   title:'YC Application',                       w:'ops',      s:'active',  d0:55, d1:56, deps:[] },
];

const WORKSTREAMS = [
  { k:'protocol', label:'Protocol' },
  { k:'product',  label:'Product'  },
  { k:'research', label:'Research' },
  { k:'comms',    label:'Comms'    },
  { k:'ops',      label:'Ops'      },
];

const STATUSES = [
  { k:'done',    label:'Done',    glyph:'●' },
  { k:'active',  label:'Active',  glyph:'◐' },
  { k:'next',    label:'Next',    glyph:'◑' },
  { k:'backlog', label:'Backlog', glyph:'○' },
];

function statusColor(s, P) {
  return s === 'done'   ? P.green
       : s === 'active' ? P.accentColor
       : s === 'next'   ? P.blue
       : P.ink5;
}

// ── The Roadmap page ──────────────────────────────────────────────
function AeoessRoadmap({ palette }) {
  const P = palette;
  const pad = 40;
  const sectionPadY = 56;
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace';

  // Gantt grid sizing
  const DAY_W       = 14;          // px per day
  const ROW_H       = 28;          // px per item row
  const ROW_GAP     = 6;
  const SWIM_PAD    = 16;          // top/bottom padding inside swimlane
  const LABEL_W     = 150;         // left swimlane label column
  const D_MIN       = 0;
  const D_MAX       = 95;
  const TIMELINE_W  = (D_MAX - D_MIN) * DAY_W;

  const TODAY = 64; // matches the YAML "Day 64" header note

  const dayX = (d) => (d - D_MIN) * DAY_W;

  // Group items per workstream + lay them out into row indexes
  const grouped = WORKSTREAMS.map(ws => {
    const items = ROADMAP.filter(it => it.w === ws.k).sort((a,b) => a.d0 - b.d0);
    // simple greedy lane packing so overlapping bars stack
    const lanes = []; // array of arrays of items
    items.forEach(it => {
      let placed = false;
      for (const lane of lanes) {
        if (lane[lane.length-1].d1 < it.d0) { lane.push(it); it._row = lanes.indexOf(lane); placed = true; break; }
      }
      if (!placed) { it._row = lanes.length; lanes.push([it]); }
    });
    return { ws, items, rowCount: Math.max(1, lanes.length) };
  });

  // Compute absolute Y coords so dependency arrows can be drawn
  const swimY = []; // [{ws, y0, h}]
  let cursor = 0;
  grouped.forEach(g => {
    const h = SWIM_PAD * 2 + g.rowCount * ROW_H + (g.rowCount - 1) * ROW_GAP;
    swimY.push({ ws: g.ws.k, y0: cursor, h });
    cursor += h;
  });
  const TOTAL_H = cursor;

  // Position lookup for a given item
  const positions = {};
  grouped.forEach((g, gi) => {
    g.items.forEach(it => {
      const sw = swimY[gi];
      const y = sw.y0 + SWIM_PAD + it._row * (ROW_H + ROW_GAP);
      const x0 = dayX(it.d0);
      const x1 = dayX(it.d1) + DAY_W * 0.8;
      positions[it.id] = { x0, x1, y, mid: y + ROW_H/2 };
    });
  });

  const weekTicks = [];
  for (let d = 0; d <= D_MAX; d += 7) weekTicks.push(d);

  // Stats counts for legend
  const counts = STATUSES.reduce((a, s) => ({ ...a, [s.k]: ROADMAP.filter(i => i.s === s.k).length }), {});

  return (
    <div data-aeoess-page="1" style={{ background:P.paper, color:P.ink, fontFamily:'-apple-system, "Inter", system-ui, sans-serif', minHeight:'100%' }}>
      <SubHeader palette={P} pad={pad}/>

      {/* Hero */}
      <section style={{ padding:`${sectionPadY}px ${pad}px ${sectionPadY-12}px` }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <SectionEyebrow palette={P}>Roadmap · YAML-driven</SectionEyebrow>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:32, flexWrap:'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(34px, 4.6vw, 54px)', lineHeight:1.05, letterSpacing:'-0.025em', fontWeight:500, margin:0, color:P.ink }}>
                Every layer, every paper,<br/>every day shipped.
              </h1>
              <p style={{ fontSize:15.5, lineHeight:1.6, color:P.ink3, marginTop:18, maxWidth:680 }}>
                Day&nbsp;1 was 2026-02-17. Today is Day&nbsp;{TODAY}. The page below is generated from a single <code style={{ fontFamily:mono, fontSize:13, padding:'1px 6px', background:P.bg, border:`1px solid ${P.ruleLight}`, borderRadius:3 }}>roadmap.yaml</code>, edit and push, the page rebuilds.
              </p>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <a href="https://github.com/aeoess/aeoess_web/blob/main/roadmap.yaml" style={secondaryBtn(P)}>View YAML source ↗</a>
              <a href="#" style={secondaryBtn(P)}>Subscribe to changes</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visualization: Cross-Impl Interop ───────────────────────── */}
      <section style={{ padding:`72px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ fontSize:11, color:P.ink5, fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:10 }}>Interop, in motion</div>
          <h2 style={{ fontSize:32, fontWeight:500, margin:0, letterSpacing:'-0.02em', color:P.ink }}>Six independent implementations. One byte-match.</h2>
          <p style={{ fontSize:15, color:P.ink3, lineHeight:1.6, marginTop:14, marginBottom:28, maxWidth:680 }}>
            Same fixture into qntm, AgentGraph, Foxbook, AgentID, Nobulex, and ArkForge. Identical SHA-256 across all six runs. CTEF v0.3.2 §A draft, public.
          </p>
          <div style={{ border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:'#1c1c1e' }}>
            <iframe src="arch-interop.html" title="Cross-Impl Interop, visualization" loading="lazy"
              style={{ display:'block', width:'100%', height:560, border:0 }}/>
          </div>
        </div>
      </section>

      {/* Legend strip */}
      <section style={{ padding:`0 ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, borderBottom:`1px solid ${P.ruleLight}`, background:P.bg }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, padding:'14px 0', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:22, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase', fontFamily:mono }}>Status</div>
            {STATUSES.map(s => (
              <div key={s.k} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, color:P.ink2 }}>
                <span style={{ color:statusColor(s.k, P), fontSize:13, lineHeight:1 }}>{s.glyph}</span>
                <span style={{ fontWeight:500 }}>{s.label}</span>
                <span style={{ color:P.ink5, fontFamily:mono, fontSize:11.5 }}>{counts[s.k] || 0}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:18, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase', fontFamily:mono }}>Total</div>
            <div style={{ fontSize:13, color:P.ink2 }}><strong style={{ color:P.ink, fontWeight:600 }}>{ROADMAP.length}</strong> items across <strong style={{ color:P.ink, fontWeight:600 }}>{WORKSTREAMS.length}</strong> workstreams</div>
          </div>
        </div>
      </section>

      {/* Gantt chart */}
      <section style={{ padding:`${sectionPadY-20}px ${pad}px ${sectionPadY}px` }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <div style={{
            border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden', background:P.paper,
          }}>
            {/* Day axis header */}
            <div style={{ display:'flex', borderBottom:`1px solid ${P.ruleLight}`, background:P.bg }}>
              <div style={{ width:LABEL_W, flex:'none', padding:'10px 16px', borderRight:`1px solid ${P.ruleLight}`, fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase', fontFamily:mono }}>Workstream</div>
              <div style={{ overflowX:'auto', flex:1 }}>
                <div style={{ width:TIMELINE_W, position:'relative', height:34 }}>
                  {weekTicks.map(d => (
                    <div key={d} style={{ position:'absolute', left:dayX(d), top:0, bottom:0, display:'flex', alignItems:'center', borderLeft: d === 0 ? 'none' : `1px solid ${P.ruleLight}`, paddingLeft:6, fontSize:11, color:P.ink5, fontFamily:mono }}>
                      Day&nbsp;{d}
                    </div>
                  ))}
                  {/* TODAY line label */}
                  <div style={{ position:'absolute', left:dayX(TODAY) - 18, top:8, fontSize:10.5, color:P.accentColor, fontFamily:mono, letterSpacing:'0.06em', textTransform:'uppercase', fontWeight:700 }}>Today</div>
                </div>
              </div>
            </div>

            {/* Body: swimlane labels + chart area */}
            <div style={{ display:'flex' }}>
              {/* Left labels column */}
              <div style={{ width:LABEL_W, flex:'none', borderRight:`1px solid ${P.ruleLight}` }}>
                {grouped.map((g, i) => {
                  const sw = swimY[i];
                  return (
                    <div key={g.ws.k} style={{
                      height:sw.h,
                      borderTop: i === 0 ? 'none' : `1px solid ${P.ruleLight}`,
                      padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'flex-start',
                    }}>
                      <div style={{ fontSize:14, fontWeight:600, color:P.ink, letterSpacing:'-0.005em' }}>{g.ws.label}</div>
                      <div style={{ fontSize:11, color:P.ink5, fontFamily:mono, marginTop:4 }}>{g.items.length} items</div>
                    </div>
                  );
                })}
              </div>

              {/* Scrollable chart */}
              <div style={{ overflowX:'auto', flex:1 }}>
                <div style={{ width:TIMELINE_W, height:TOTAL_H, position:'relative' }}>
                  {/* Week gridlines */}
                  {weekTicks.map(d => (
                    <div key={d} style={{ position:'absolute', left:dayX(d), top:0, bottom:0, width:1, background: d === 0 ? 'transparent' : P.ruleLight }}/>
                  ))}
                  {/* TODAY indicator line */}
                  <div style={{ position:'absolute', left:dayX(TODAY), top:0, bottom:0, width:1, background:P.accentColor, opacity:0.65 }}/>
                  <div style={{ position:'absolute', left:dayX(TODAY) - 4, top:0, width:8, height:8, background:P.accentColor, borderRadius:'50%' }}/>

                  {/* Swimlane separators */}
                  {grouped.map((g, i) => i === 0 ? null : (
                    <div key={g.ws.k} style={{ position:'absolute', left:0, right:0, top:swimY[i].y0, height:1, background:P.ruleLight }}/>
                  ))}

                  {/* Dependency arrows (SVG layer) */}
                  <svg width={TIMELINE_W} height={TOTAL_H} style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
                    <defs>
                      <marker id="rm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill={P.ink5}/>
                      </marker>
                    </defs>
                    {ROADMAP.flatMap(it => (it.deps || []).map(depId => {
                      const a = positions[depId]; const b = positions[it.id];
                      if (!a || !b) return null;
                      const x1 = a.x1, y1 = a.mid;
                      const x2 = b.x0,  y2 = b.mid;
                      const mx = Math.max(x1 + 8, x2 - 8);
                      return (
                        <path key={`${depId}-${it.id}`}
                          d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                          fill="none" stroke={P.rule} strokeWidth="1" strokeDasharray="2 3"
                          markerEnd="url(#rm-arrow)"/>
                      );
                    }))}
                  </svg>

                  {/* Bars */}
                  {ROADMAP.map(it => {
                    const p = positions[it.id]; if (!p) return null;
                    const w = Math.max(DAY_W * 0.9, p.x1 - p.x0);
                    const c = statusColor(it.s, P);
                    const isMilestone = it.d0 === it.d1;
                    return (
                      <div key={it.id} title={`${it.title} · day ${it.d0}${it.d0!==it.d1 ? '–'+it.d1 : ''} · ${it.s}`}
                        style={{
                          position:'absolute', left:p.x0, top:p.y, height:ROW_H, width:w,
                          display:'flex', alignItems:'center', gap:8,
                          padding:'0 10px',
                          background: it.s === 'done' ? P.bg : P.paper,
                          border:`1px solid ${c}`,
                          borderLeft: `3px solid ${c}`,
                          borderRadius:3,
                          fontSize:12, color:P.ink, fontWeight:500,
                          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                          cursor:'default',
                          boxShadow: it.s === 'active' ? `0 0 0 2px ${P.paper}, 0 0 0 3px ${c}33` : 'none',
                        }}>
                        <span style={{ color:c, fontSize:11, lineHeight:1 }}>
                          {isMilestone ? '◆' : (it.s === 'done' ? '●' : it.s === 'active' ? '◐' : '○')}
                        </span>
                        <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize:12, color:P.ink5, marginTop:14, fontStyle:'italic', maxWidth:780 }}>
            Bars are sized by day range. Dotted curves are explicit YAML <code style={{ fontFamily:mono }}>dependencies</code>. The vertical accent line marks the current day. Scroll horizontally to see the full backlog window.
          </p>
        </div>
      </section>

      {/* Per-workstream summary tables */}
      {WORKSTREAMS.map((ws, wi) => {
        const items = ROADMAP.filter(i => i.w === ws.k);
        return (
          <section key={ws.k} style={{ padding:`${sectionPadY-20}px ${pad}px`, borderTop:`1px solid ${P.ruleLight}`, background: wi % 2 ? P.bg : P.paper }}>
            <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'200px 1fr', gap:48 }}>
              <div>
                <div style={{ fontFamily:mono, fontSize:11, color:P.ink5, letterSpacing:'0.10em', textTransform:'uppercase' }}>§ {wi+1}</div>
                <h2 style={{ fontSize:22, fontWeight:500, letterSpacing:'-0.015em', color:P.ink, marginTop:6, lineHeight:1.2 }}>{ws.label}</h2>
                <div style={{ fontSize:12, color:P.ink4, marginTop:6 }}>{items.length} items · {items.filter(i=>i.s==='done').length} done</div>
              </div>
              <div>
                {items.map((it, i) => (
                  <div key={it.id} style={{
                    display:'grid', gridTemplateColumns:'70px 90px 1fr 80px',
                    gap:18, alignItems:'baseline',
                    padding:'12px 0', borderTop: i === 0 ? `1px solid ${P.rule}` : `1px solid ${P.ruleLight}`,
                  }}>
                    <span style={{ fontFamily:mono, fontSize:12, color:P.ink5 }}>
                      D{it.d0}{it.d0!==it.d1 ? `–${it.d1}` : ''}
                    </span>
                    <span style={{ fontSize:10.5, color:statusColor(it.s, P), letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:700, fontFamily:mono }}>{it.s}</span>
                    <span style={{ fontSize:13.5, color:P.ink, fontWeight:500 }}>{it.title}</span>
                    <span style={{ fontFamily:mono, fontSize:11, color:P.ink5, textAlign:'right' }}>{it.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <Footer palette={P} pad={pad}/>
    </div>
  );
}

Object.assign(window, { AeoessRoadmap });
