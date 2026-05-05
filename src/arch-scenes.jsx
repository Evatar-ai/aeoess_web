// arch-scenes.jsx
// Six scenes of the protocol architecture animation, sized for a 1920x1080 stage.
// Each scene exports a component that takes no props and reads useTime/useSprite from window.

// Palette — brand monochrome on cream paper; rust accent used sparingly.
// Drives both the scene visuals and the chrome.
const A_BG = '#f6f4ef';
const A_BG_2 = '#ede8dc';
const A_INK = '#1a1816';
const A_INK_2 = '#4a463e';
const A_INK_3 = '#6b6458';
const A_LINE = 'rgba(26,24,22,0.08)';
const A_LINE_2 = 'rgba(26,24,22,0.22)';
const A_ACCENT = '#c2402a';        // rust — for hot/critical states
const A_ACCENT_GLOW = 'rgba(194,64,42,0.18)';
const A_DANGER = '#c2402a';        // same — monochrome discipline

// reusable label/caption -- positioned in stage coords
function CaptionBlock({ x, y, eyebrow, title, body, align = 'left' }) {
  const { progress, localTime, duration } = useSprite();
  const t = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));
  const exitT = duration > 0 ? clamp((localTime - (duration - 0.6)) / 0.6, 0, 1) : 0;
  const opacity = t * (1 - exitT);
  const ty = (1 - t) * 14 + exitT * -8;
  const alignTransform = align === 'center' ? 'translateX(-50%)' : (align === 'right' ? 'translateX(-100%)' : 'translateX(0)');
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `${alignTransform} translateY(${ty}px)`,
      opacity,
      maxWidth: align === 'center' ? 1200 : 760,
      textAlign: align,
      pointerEvents: 'none',
    }}>
      {eyebrow && <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 18, letterSpacing: '0.3em',
        color: A_ACCENT, marginBottom: 14, textTransform: 'uppercase', fontWeight: 500
      }}>{eyebrow}</div>}
      {title && <div style={{
        fontFamily: 'Fraunces, serif', fontSize: 76, lineHeight: 1.0, letterSpacing: '-0.02em',
        color: A_INK, fontWeight: 400, marginBottom: 22, textWrap: 'balance',
        fontVariationSettings: '"opsz" 144'
      }}>{title}</div>}
      {body && <div style={{
        fontFamily: 'Fraunces, serif', fontSize: 28, lineHeight: 1.4,
        color: A_INK_2, fontWeight: 300, textWrap: 'pretty', fontStyle: 'italic'
      }}>{body}</div>}
    </div>
  );
}

// ============================================================ COLD OPEN
function SceneOpen() {
  const { localTime, duration } = useSprite();
  const t = clamp(localTime, 0, duration);

  // grid graphic: rotating wireframe sphere of dots
  const dotN = 64;
  const dots = [];
  const rot = t * 0.18;
  for (let i = 0; i < dotN; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / dotN);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i + rot;
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    const scale = 1 / (1.6 - z * 0.6);
    const screenX = 960 + x * 320 * scale;
    const screenY = 540 + y * 320 * scale;
    const op = clamp(0.15 + (z + 1) * 0.42, 0.1, 0.95);
    const r = 1.2 + (z + 1) * 1.4;
    dots.push({ screenX, screenY, op, r, key: i });
  }

  // intro fade
  const introT = Easing.easeOutCubic(clamp(t / 1.6, 0, 1));
  // outro fade for sphere
  const outroT = clamp((t - (duration - 1.2)) / 1.2, 0, 1);
  const sphereOp = introT * (1 - outroT);

  // staggered title reveals
  const titleT = clamp((t - 1.4) / 0.9, 0, 1);
  const sub1T  = clamp((t - 2.4) / 0.8, 0, 1);
  const sub2T  = clamp((t - 3.5) / 0.8, 0, 1);
  const eyebrowT = clamp((t - 0.8) / 0.6, 0, 1);
  const exitT = clamp((t - (duration - 0.8)) / 0.8, 0, 1);

  const fade = (v) => v * (1 - exitT);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* sphere */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: sphereOp }}>
        {dots.map(d => (
          <circle key={d.key} cx={d.screenX} cy={d.screenY} r={d.r} fill={A_INK} opacity={d.op * 0.5} />
        ))}
      </svg>
      {/* eyebrow */}
      <div style={{
        position: 'absolute', left: '50%', top: 220, transform: `translateX(-50%) translateY(${(1 - eyebrowT) * 10}px)`,
        opacity: fade(Easing.easeOutCubic(eyebrowT)),
        fontFamily: 'JetBrains Mono, monospace', fontSize: 20, letterSpacing: '0.4em', color: A_ACCENT, fontWeight: 500
      }}>
        AEOESS · PROTOCOL ARCHITECTURE
      </div>
      {/* title 1 */}
      <div style={{
        position: 'absolute', left: '50%', top: 370, transform: `translateX(-50%) translateY(${(1 - Easing.easeOutCubic(titleT)) * 22}px)`,
        opacity: fade(titleT),
        fontFamily: 'Fraunces, serif', fontSize: 168, lineHeight: 0.94, letterSpacing: '-0.025em',
        color: A_INK, fontWeight: 400, fontVariationSettings: '"opsz" 144', textAlign: 'center', whiteSpace: 'nowrap'
      }}>
        Six movements,
      </div>
      <div style={{
        position: 'absolute', left: '50%', top: 540, transform: `translateX(-50%) translateY(${(1 - Easing.easeOutCubic(sub1T)) * 22}px)`,
        opacity: fade(sub1T),
        fontFamily: 'Fraunces, serif', fontSize: 168, lineHeight: 0.94, letterSpacing: '-0.025em',
        color: A_INK, fontWeight: 400, fontVariationSettings: '"opsz" 144', textAlign: 'center', whiteSpace: 'nowrap'
      }}>
        one <span style={{ fontStyle: 'italic', color: A_ACCENT }}>signature.</span>
      </div>
      {/* tagline */}
      <div style={{
        position: 'absolute', left: '50%', top: 800, transform: `translateX(-50%) translateY(${(1 - Easing.easeOutCubic(sub2T)) * 14}px)`,
        opacity: fade(sub2T),
        fontFamily: 'JetBrains Mono, monospace', fontSize: 22, letterSpacing: '0.18em', color: A_INK_2, textTransform: 'uppercase', fontWeight: 400
      }}>
        from a person, through a machine, to a record
      </div>
    </div>
  );
}

// ============================================================ SCENE 1 — Life of an action
function SceneOne() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const stages = [
    { lbl: 'passport',    sub: 'Ed25519 + DID' },
    { lbl: 'delegation',  sub: 'scope narrowed' },
    { lbl: 'intent',      sub: 'signed ask' },
    { lbl: 'gateway',     sub: '14 checks' },
    { lbl: 'enforcement', sub: 'rail adapter' },
    { lbl: 'receipt',     sub: 'canonical JSON' },
  ];
  const xs = stages.map((_, i) => 200 + i * 304);
  const railY = 540;

  // node reveal staggered
  const nodeReveal = (i) => clamp((t - (1.2 + i * 0.55)) / 0.55, 0, 1);
  // dot traverses 1 → 6 over 4.4s, starting at 1.6s
  const dotProgress = clamp((t - 1.8) / 4.6, 0, 1);
  const dotEase = Easing.easeInOutCubic(dotProgress);
  const dotX = xs[0] + dotEase * (xs[5] - xs[0]);

  // gateway "judgement" pulse when dot reaches it
  const gateProgress = clamp((dotEase * 5 - 2.6), 0, 1); // around stage 4 (i=3)
  const gatePulse = gateProgress > 0 && gateProgress < 1 ? Math.sin(gateProgress * Math.PI) : 0;

  // exit
  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const fade = (v) => v * (1 - ex);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* rail */}
        <line x1={xs[0]} y1={railY} x2={xs[5]} y2={railY} stroke={A_LINE_2} strokeWidth="1.2" opacity={fade(clamp(t / 0.8, 0, 1))} />
        {/* arrows between */}
        {xs.slice(0, 5).map((x, i) => {
          const op = fade(nodeReveal(i + 1) * 0.5);
          const mid = (x + xs[i+1]) / 2;
          return (
            <text key={i} x={mid} y={railY + 5} textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="22" opacity={op}>→</text>
          );
        })}
        {/* nodes */}
        {stages.map((s, i) => {
          const r = nodeReveal(i);
          const ease = Easing.easeOutBack(r);
          const op = fade(r);
          const isGate = i === 3;
          const hot = isGate && gatePulse > 0;
          const radius = 36 * ease + (hot ? 8 * gatePulse : 0);
          return (
            <g key={i} opacity={op} transform={`translate(${xs[i]}, ${railY})`}>
              {hot && <circle r={radius + 18} fill="none" stroke={A_ACCENT} strokeWidth="1.2" opacity={gatePulse * 0.6} />}
              <circle r={radius} fill={A_BG} stroke={hot ? A_ACCENT : A_INK_3} strokeWidth={hot ? 2 : 1} filter={hot ? `drop-shadow(0 0 18px ${A_ACCENT_GLOW})` : ''} />
              <circle r={5} fill={hot ? A_ACCENT : A_INK_2} />
              <text y={-58} textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="16" letterSpacing="0.2em">
                {String(i + 1).padStart(2, '0')}
              </text>
              <text y={84} textAnchor="middle" fill={A_INK} fontFamily="Fraunces" fontSize="28" fontStyle="italic" fontWeight="500">
                {s.lbl}
              </text>
              <text y={114} textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.16em" textTransform="uppercase">
                {s.sub.toUpperCase()}
              </text>
            </g>
          );
        })}
        {/* travelling dot */}
        {dotProgress > 0 && dotProgress < 1 && (
          <g>
            <circle cx={dotX} cy={railY} r={9} fill={A_ACCENT} filter={`drop-shadow(0 0 14px ${A_ACCENT_GLOW})`} />
            <circle cx={dotX} cy={railY} r={20} fill="none" stroke={A_ACCENT} strokeOpacity="0.4" />
          </g>
        )}
      </svg>

      {/* caption block */}
      <CaptionBlock
        x={120} y={140}
        eyebrow="i · life of an action"
        title="Six checkpoints. Each signed."
        body="From a passport at the root to a canonical receipt at the tail — every step in between is signed and replayable."
      />
    </div>
  );
}

// ============================================================ SCENE 2 — Delegation cascade
function SceneTwo() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  // tree layout
  const root = { x: 960, y: 220, depth: 0 };
  const lvl1 = [
    { id: 'orchestrator', x: 540,  y: 460, depth: 1 },
    { id: 'researcher',   x: 960,  y: 460, depth: 1 },
    { id: 'payer-bot',    x: 1380, y: 460, depth: 1, doomed: true },
  ];
  const lvl2 = [
    { p: 'orchestrator', x: 380,  y: 700, depth: 2 },
    { p: 'orchestrator', x: 540,  y: 700, depth: 2 },
    { p: 'orchestrator', x: 700,  y: 700, depth: 2 },
    { p: 'researcher',   x: 880,  y: 700, depth: 2 },
    { p: 'researcher',   x: 1040, y: 700, depth: 2 },
    { p: 'payer-bot',    x: 1240, y: 700, depth: 2, doomed: true },
    { p: 'payer-bot',    x: 1400, y: 700, depth: 2, doomed: true },
    { p: 'payer-bot',    x: 1560, y: 700, depth: 2, doomed: true },
  ];
  const lvl3 = [];
  for (let i = 0; i < 12; i++) {
    const parent = lvl2[i % lvl2.length];
    const offset = (i % 3 - 1) * 36;
    lvl3.push({ p: parent, x: parent.x + offset, y: 880, depth: 3, doomed: parent.doomed });
  }

  // reveal: root → lvl1 → lvl2 → lvl3 over 0..3.4s
  const rRoot = clamp(t / 0.4, 0, 1);
  const rL1   = clamp((t - 0.6) / 0.6, 0, 1);
  const rL2   = clamp((t - 1.4) / 0.7, 0, 1);
  const rL3   = clamp((t - 2.2) / 0.9, 0, 1);
  // revoke at t=5.4 → cascade outward
  const rRev  = clamp((t - 5.4) / 0.4, 0, 1);
  const rC1   = clamp((t - 5.7) / 0.4, 0, 1);
  const rC2   = clamp((t - 6.0) / 0.5, 0, 1);

  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const fade = (v) => v * (1 - ex);

  function nodeFill(node) {
    if (!node.doomed) return A_BG_2;
    const cascade = node.depth === 1 ? rRev : (node.depth === 2 ? rC1 : rC2);
    if (cascade < 0.3) return A_BG_2;
    return cascade < 0.7 ? `rgba(255,107,107,0.18)` : A_DANGER;
  }
  function nodeStroke(node) {
    if (!node.doomed) return node.depth === 0 ? A_ACCENT : A_INK_3;
    const cascade = node.depth === 1 ? rRev : (node.depth === 2 ? rC1 : rC2);
    return cascade > 0.2 ? A_DANGER : A_INK_3;
  }
  function edgeOp(node) {
    const baseOp = node.depth === 1 ? rL1 : (node.depth === 2 ? rL2 : rL3);
    const exit = node.doomed ? (node.depth === 1 ? rRev : (node.depth === 2 ? rC1 : rC2)) : 0;
    return baseOp * (1 - exit * 0.6);
  }
  function edgeColor(node) {
    if (!node.doomed) return A_LINE_2;
    const cascade = node.depth === 1 ? rRev : (node.depth === 2 ? rC1 : rC2);
    return cascade > 0.3 ? A_DANGER : A_LINE_2;
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* edges root → lvl1 */}
        {lvl1.map((n, i) => (
          <line key={'e1'+i} x1={root.x} y1={root.y} x2={n.x} y2={n.y} stroke={edgeColor(n)} strokeWidth="1.5" opacity={fade(edgeOp(n))} strokeDasharray={n.doomed && rRev > 0.3 ? '4 4' : ''} />
        ))}
        {/* edges lvl1 → lvl2 */}
        {lvl2.map((n, i) => {
          const parent = lvl1.find(p => p.id === n.p);
          return <line key={'e2'+i} x1={parent.x} y1={parent.y} x2={n.x} y2={n.y} stroke={edgeColor(n)} strokeWidth="1.2" opacity={fade(edgeOp(n))} strokeDasharray={n.doomed && rC1 > 0.3 ? '4 4' : ''} />;
        })}
        {/* edges lvl2 → lvl3 */}
        {lvl3.map((n, i) => (
          <line key={'e3'+i} x1={n.p.x} y1={n.p.y} x2={n.x} y2={n.y} stroke={edgeColor(n)} strokeWidth="0.8" opacity={fade(edgeOp(n))} strokeDasharray={n.doomed && rC2 > 0.3 ? '3 3' : ''} />
        ))}
        {/* root */}
        <g opacity={fade(Easing.easeOutBack(rRoot))} transform={`translate(${root.x}, ${root.y})`}>
          <circle r={36} fill={A_ACCENT} />
          <text y={9} textAnchor="middle" fill={A_BG} fontFamily="Fraunces" fontSize="32" fontWeight="600">H</text>
          <text y={-58} textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.2em">ROOT.PASS</text>
        </g>
        {/* lvl1 */}
        {lvl1.map((n, i) => (
          <g key={'n1'+i} opacity={fade(Easing.easeOutBack(rL1))} transform={`translate(${n.x},${n.y})`}>
            <circle r={22} fill={nodeFill(n)} stroke={nodeStroke(n)} strokeWidth="1.5" />
            <text y={48} textAnchor="middle" fill={n.doomed && rRev > 0.4 ? A_DANGER : A_INK_2} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.12em" textTransform="uppercase">
              {n.id}
            </text>
            {n.doomed && rRev > 0.5 && (
              <g>
                <circle r={36} fill="none" stroke={A_DANGER} strokeWidth="1.2" strokeDasharray="3 3" />
                <text y={-32} textAnchor="middle" fill={A_DANGER} fontFamily="Fraunces" fontSize="16" fontStyle="italic">revoke()</text>
              </g>
            )}
          </g>
        ))}
        {/* lvl2 */}
        {lvl2.map((n, i) => (
          <g key={'n2'+i} opacity={fade(Easing.easeOutCubic(rL2))} transform={`translate(${n.x},${n.y})`}>
            <circle r={12} fill={nodeFill(n)} stroke={nodeStroke(n)} strokeWidth="1" />
          </g>
        ))}
        {/* lvl3 */}
        {lvl3.map((n, i) => (
          <g key={'n3'+i} opacity={fade(Easing.easeOutCubic(rL3))} transform={`translate(${n.x},${n.y})`}>
            <circle r={6} fill={nodeFill(n)} stroke={nodeStroke(n)} strokeWidth="0.8" />
          </g>
        ))}
      </svg>

      <CaptionBlock
        x={120} y={140}
        eyebrow="ii · delegation & cascade"
        title="Authority can only narrow."
        body="Revoke any node and the entire subtree denies on the next request. Fail-closed at the gateway, in one call."
      />

      {rRev > 0.6 && (
        <div style={{
          position: 'absolute', right: 120, top: 600,
          opacity: fade(rRev),
          textAlign: 'right',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, letterSpacing: '0.24em', color: A_DANGER, marginBottom: 8 }}>
            REVOKE(payer-bot)
          </div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontStyle: 'italic', color: A_INK_2 }}>
            subtree denies on next attempt.
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================ SCENE 3 — Gateway 14 gates
function SceneThree() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const items = ['identity','signature','scope','budget','rate','values','reputation','freshness','provenance','destination','payload-shape','cap-ledger','jurisdiction','conformance'];

  // each gate "lights up" sequentially, evaluated 0..14
  const evalStart = 1.0;
  const evalEnd = 6.5;
  const span = evalEnd - evalStart;
  const evalProgress = clamp((t - evalStart) / span, 0, 1);
  const cursorAt = evalProgress * items.length;

  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const fade = (v) => v * (1 - ex);

  // verdict at t > 7s
  const verdictT = clamp((t - 7.0) / 0.6, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* incoming intent */}
        <g opacity={fade(clamp(t/0.5,0,1))}>
          <rect x="120" y="490" width="240" height="100" fill="none" stroke={A_LINE_2} strokeWidth="1" rx="3" />
          <text x="240" y="528" textAnchor="middle" fill={A_INK} fontFamily="Fraunces" fontSize="26" fontStyle="italic">intent</text>
          <text x="240" y="556" textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.18em">SIGNED</text>
          <line x1="360" y1="540" x2="540" y2="540" stroke={A_LINE_2} strokeWidth="1" />
        </g>

        {/* 14 gates as horizontal bars stacked */}
        {items.map((label, i) => {
          const y = 200 + i * 48;
          const reveal = clamp((t - (0.4 + i * 0.06)) / 0.4, 0, 1);
          const isLit = cursorAt > i + 0.5;
          const isCurrent = Math.floor(cursorAt) === i;
          const colour = isLit ? A_ACCENT : (isCurrent ? A_INK : A_INK_3);
          const op = fade(reveal);
          return (
            <g key={i} opacity={op}>
              <text x={580} y={y + 5} textAnchor="end" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.12em">
                {String(i+1).padStart(2,'0')}
              </text>
              <line x1={600} x2={1100} y1={y} y2={y} stroke={isLit ? A_ACCENT : A_LINE_2} strokeWidth={isLit ? 1.5 : 1} opacity={isLit ? 0.7 : 1} />
              <text x={618} y={y - 8} fill={colour} fontFamily="Fraunces" fontSize="20" fontStyle="italic" fontWeight={isCurrent ? 600 : 400}>{label}</text>
              {isLit && <circle cx={1100} cy={y} r={4} fill={A_ACCENT} filter={`drop-shadow(0 0 6px ${A_ACCENT_GLOW})`} />}
            </g>
          );
        })}

        {/* verdict */}
        <g opacity={fade(verdictT)}>
          <line x1={1100} y1={540} x2={1280} y2={540} stroke={A_ACCENT} strokeWidth="2" />
          <rect x="1280" y="490" width="240" height="100" fill="none" stroke={A_ACCENT} strokeWidth="1.5" rx="3" filter={`drop-shadow(0 0 18px ${A_ACCENT_GLOW})`} />
          <text x="1400" y="528" textAnchor="middle" fill={A_ACCENT} fontFamily="Fraunces" fontSize="32" fontStyle="italic" fontWeight="500">ALLOW</text>
          <text x="1400" y="558" textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.18em">14 / 14 PASS</text>
        </g>
        {/* deny secondary, faded */}
        <g opacity={fade(0.35) * (verdictT > 0 ? 1 : 0)}>
          <rect x="1280" y="700" width="240" height="100" fill="none" stroke={A_DANGER} strokeWidth="1" strokeDasharray="3 3" rx="3" />
          <text x="1400" y="738" textAnchor="middle" fill={A_DANGER} fontFamily="Fraunces" fontSize="28" fontStyle="italic">DENY</text>
          <text x="1400" y="768" textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.18em">FAIL-CLOSED</text>
        </g>
      </svg>

      <CaptionBlock
        x={120} y={140}
        eyebrow="iii · gateway judgement"
        title="Fourteen checks. No bypass."
        body="A missing or ambiguous check is a denial. Fail-closed by default; 37 + 10 conformance vectors enforce it on every commit."
      />
    </div>
  );
}

// ============================================================ SCENE 4 — Trust mesh
function SceneFour() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  // generate mesh nodes (deterministic)
  const N = 48;
  let s = 17;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const nodes = React.useMemo(() => {
    let seed = 17;
    const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const arr = [];
    arr.push({ x: 480,  y: 380, type: 'human', label: 'HUMAN A' });
    arr.push({ x: 1480, y: 420, type: 'human', label: 'HUMAN B' });
    arr.push({ x: 960,  y: 740, type: 'human', label: 'HUMAN C' });
    for (let i = 3; i < N; i++) {
      arr.push({ x: 220 + r() * 1480, y: 200 + r() * 660, type: r() > 0.7 ? 'service' : 'agent' });
    }
    return arr;
  }, []);
  const edges = React.useMemo(() => {
    const e = [];
    for (let i = 0; i < nodes.length; i++) {
      const cands = nodes.map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) })).filter(o => o.j !== i).sort((a,b) => a.d - b.d);
      const k = 1 + Math.floor(((i * 91 + 13) % 100) / 50);
      for (let m = 0; m < k && m < cands.length; m++) {
        const j = cands[m].j;
        if (i < j) e.push([i, j]);
      }
    }
    return e;
  }, [nodes]);

  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const fade = (v) => v * (1 - ex);

  // edge reveal staggered
  const buildT = clamp(t / 4.5, 0, 1);
  const visibleEdges = Math.floor(buildT * edges.length);

  // pulse: pick an edge to flash a packet along periodically
  const pulse = (id, offset) => {
    const cycle = 1.6;
    const phase = ((t - offset) % cycle) / cycle;
    return phase >= 0 && phase < 1 ? phase : -1;
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* edges */}
        {edges.slice(0, visibleEdges + 6).map(([a, b], i) => {
          const reveal = clamp((t * (edges.length / 4.5) - i) / 1.0, 0, 1);
          const op = fade(reveal * 0.35);
          return (
            <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
              stroke={A_LINE_2} strokeWidth="0.8" opacity={op} />
          );
        })}
        {/* pulses on a few representative edges */}
        {[0, 5, 11, 17, 25, 33].map((idx, k) => {
          if (idx >= edges.length || idx >= visibleEdges) return null;
          const [a, b] = edges[idx];
          const p = pulse(idx, k * 0.3);
          if (p < 0) return null;
          const px = nodes[a].x + (nodes[b].x - nodes[a].x) * p;
          const py = nodes[a].y + (nodes[b].y - nodes[a].y) * p;
          return <circle key={'p'+k} cx={px} cy={py} r={3} fill={A_ACCENT} opacity={fade(0.9)} filter={`drop-shadow(0 0 6px ${A_ACCENT_GLOW})`} />;
        })}
        {/* nodes */}
        {nodes.map((n, i) => {
          const reveal = clamp((t - i * 0.05) / 0.5, 0, 1);
          const op = fade(Easing.easeOutCubic(reveal));
          if (n.type === 'human') {
            return (
              <g key={i} opacity={op}>
                <circle cx={n.x} cy={n.y} r={22} fill={A_ACCENT} filter={`drop-shadow(0 0 14px ${A_ACCENT_GLOW})`} />
                <text x={n.x + 32} y={n.y + 6} fill={A_INK} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.2em">{n.label}</text>
              </g>
            );
          }
          return (
            <circle key={i} cx={n.x} cy={n.y} r={5 + Math.sin(t + i) * 0.4} fill={A_BG_2} stroke={A_INK_3} strokeWidth="1" opacity={op * 0.85} />
          );
        })}
      </svg>

      <CaptionBlock
        x={120} y={140}
        eyebrow="iv · trust mesh"
        title="Every chain ends in a person."
        body="Agents and services bind through signed delegations and settled receipts. Reputation is earned through completed work — never declared."
      />
    </div>
  );
}

// ============================================================ SCENE 5 — Payment rails
function SceneFive() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const rails = ['x402','AP2','ACP','MPP','Stripe Issuing'];
  const railX0 = 480, railX1 = 1440, gateX = 960;

  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const fade = (v) => v * (1 - ex);

  // build: agent + merchant + rails appear, then 3 packets travel left→right
  const setupT = clamp(t / 1.4, 0, 1);
  // packet animation: spawn pulses on each rail at staggered times
  const packets = [];
  rails.forEach((_, i) => {
    const baseStart = 1.6 + i * 0.5;
    for (let k = 0; k < 2; k++) {
      const start = baseStart + k * 3.2;
      const dur = 2.6;
      const p = clamp((t - start) / dur, 0, 1);
      if (p > 0 && p < 1) packets.push({ rail: i, p });
    }
  });

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Agent box */}
        <g opacity={fade(setupT)}>
          <rect x="200" y="320" width="280" height="440" fill="none" stroke={A_LINE_2} strokeWidth="1" rx="3" />
          <text x="340" y="450" textAnchor="middle" fill={A_INK} fontFamily="Fraunces" fontSize="40" fontStyle="italic" fontWeight="500">agent</text>
          <text x="340" y="488" textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.2em">SIGNED INTENT</text>
        </g>

        {/* Merchant box */}
        <g opacity={fade(setupT)}>
          <rect x="1440" y="320" width="280" height="440" fill="none" stroke={A_LINE_2} strokeWidth="1" rx="3" />
          <text x="1580" y="450" textAnchor="middle" fill={A_INK} fontFamily="Fraunces" fontSize="40" fontStyle="italic" fontWeight="500">merchant</text>
          <text x="1580" y="488" textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.2em">SETTLEMENT</text>
        </g>

        {/* rails */}
        {rails.map((r, i) => {
          const y = 380 + i * 64;
          const reveal = clamp((t - 0.4 - i * 0.12) / 0.5, 0, 1);
          return (
            <g key={i} opacity={fade(reveal)}>
              <line x1={railX0} y1={y} x2={railX1} y2={y} stroke={A_LINE_2} strokeWidth="1" />
              <text x={railX0 - 16} y={y + 5} textAnchor="end" fill={A_INK_2} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.16em">{r}</text>
              <text x={railX1 + 16} y={y + 5} textAnchor="start" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="12" letterSpacing="0.12em">RAIL {String(i+1).padStart(2,'0')}</text>
              {/* gate tick */}
              <line x1={gateX} y1={y - 14} x2={gateX} y2={y + 14} stroke={A_INK_3} strokeWidth="1" />
            </g>
          );
        })}

        {/* scope check column */}
        <g opacity={fade(clamp((t - 1.2) / 0.6, 0, 1))}>
          <line x1={gateX} y1={340} x2={gateX} y2={760} stroke={A_ACCENT} strokeWidth="1.5" filter={`drop-shadow(0 0 14px ${A_ACCENT_GLOW})`} />
          <text x={gateX} y={326} textAnchor="middle" fill={A_ACCENT} fontFamily="JetBrains Mono" fontSize="14" letterSpacing="0.2em" fontWeight="600">SCOPE CHECK</text>
          <text x={gateX} y={788} textAnchor="middle" fill={A_INK_2} fontFamily="Fraunces" fontSize="20" fontStyle="italic">cap · merchant · single-use</text>
        </g>

        {/* packets */}
        {packets.map((pk, i) => {
          const y = 380 + pk.rail * 64;
          // ease through gate: linear left→right but pause at gate
          const x = railX0 + pk.p * (railX1 - railX0);
          // gate pulse on cross
          const nearGate = Math.abs(x - gateX) < 30;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={5} fill={A_ACCENT} filter={`drop-shadow(0 0 8px ${A_ACCENT_GLOW})`} />
              {nearGate && <circle cx={gateX} cy={y} r={14} fill="none" stroke={A_ACCENT} strokeWidth="1.5" opacity="0.7" />}
            </g>
          );
        })}
      </svg>

      <CaptionBlock
        x={120} y={140}
        eyebrow="v · payment rails"
        title="Five rails. One sharp check."
        body="Agent pays under cap. Merchant receives a signed period record. The protocol replaces no rail and respects every rail's local rules."
      />
    </div>
  );
}

// ============================================================ SCENE 6 — Cross-impl interop
function SceneSix() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const impls = ['qntm','AgentGraph','Foxbook','AgentID','Nobulex','ArkForge'];

  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const fade = (v) => v * (1 - ex);

  const setupT = clamp(t / 1.0, 0, 1);
  // 6 lines fan out from fixture, each gets a packet that travels and lands on hash
  const packetT = (i) => clamp((t - 1.4 - i * 0.18) / 2.0, 0, 1);
  // hash convergence: when all packets arrive, hash glows
  const allArrived = impls.every((_, i) => packetT(i) >= 0.95);
  const hashGlow = clamp((t - 4.0) / 0.8, 0, 1);

  // bezier from fixture (right edge) to hash (left edge), going through midpoint with vertical offset
  const fixtureR = { x: 380, y: 540 };
  const hashL    = { x: 1520, y: 540 };

  function bezierAt(p, midY) {
    // cubic from fixture to hash via two control points spread vertically
    const c1x = 720, c1y = midY;
    const c2x = 1180, c2y = midY;
    const a = (1 - p);
    const x = a*a*a * fixtureR.x + 3*a*a*p * c1x + 3*a*p*p * c2x + p*p*p * hashL.x;
    const y = a*a*a * fixtureR.y + 3*a*a*p * c1y + 3*a*p*p * c2y + p*p*p * hashL.y;
    return { x, y };
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {/* Fixture */}
        <g opacity={fade(setupT)}>
          <rect x="180" y="380" width="200" height="320" fill="none" stroke={A_LINE_2} strokeWidth="1" rx="3" />
          <text x="280" y="528" textAnchor="middle" fill={A_INK} fontFamily="Fraunces" fontSize="36" fontStyle="italic" fontWeight="500">fixture</text>
          <text x="280" y="558" textAnchor="middle" fill={A_INK_3} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.18em">CTEF v0.3.2 §A</text>
        </g>
        {/* Hash */}
        <g opacity={fade(setupT)}>
          <rect x="1520" y="380" width="240" height="320" fill="none" stroke={hashGlow > 0 ? A_ACCENT : A_LINE_2} strokeWidth="1.5" rx="3" filter={hashGlow > 0 ? `drop-shadow(0 0 ${24 * hashGlow}px ${A_ACCENT_GLOW})` : ''} />
          <text x="1640" y="510" textAnchor="middle" fill={hashGlow > 0 ? A_ACCENT : A_INK} fontFamily="Fraunces" fontSize="32" fontStyle="italic" fontWeight="500">SHA-256</text>
          <text x="1640" y="544" textAnchor="middle" fill={A_INK_2} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.1em">7e3a · 9c41 · 1d8b</text>
          <text x="1640" y="586" textAnchor="middle" fill={hashGlow > 0 ? A_ACCENT : A_INK_3} fontFamily="JetBrains Mono" fontSize="13" letterSpacing="0.18em">{hashGlow > 0 ? 'IDENTICAL · ALL 6' : 'AWAITING 6 RUNS'}</text>
        </g>

        {/* 6 paths */}
        {impls.map((name, i) => {
          const midY = 540 + (i - 2.5) * 90;
          const reveal = clamp((t - 0.8 - i * 0.1) / 0.8, 0, 1);
          // sample many points along curve
          const pathPts = [];
          for (let k = 0; k <= 40; k++) {
            const p = k / 40;
            const pt = bezierAt(p, midY);
            pathPts.push(`${k===0?'M':'L'} ${pt.x},${pt.y}`);
          }
          return (
            <g key={i} opacity={fade(reveal)}>
              <path d={pathPts.join(' ')} fill="none" stroke={A_LINE_2} strokeWidth="0.9" />
              {/* mid label */}
              <text x={950} y={midY - 10} textAnchor="middle" fill={A_INK_2} fontFamily="Fraunces" fontSize="20" fontStyle="italic">{name}</text>
            </g>
          );
        })}

        {/* packets */}
        {impls.map((_, i) => {
          const p = packetT(i);
          if (p <= 0 || p >= 1) return null;
          const midY = 540 + (i - 2.5) * 90;
          const pt = bezierAt(p, midY);
          return <circle key={i} cx={pt.x} cy={pt.y} r={5} fill={A_ACCENT} filter={`drop-shadow(0 0 8px ${A_ACCENT_GLOW})`} />;
        })}
      </svg>

      <CaptionBlock
        x={120} y={140}
        eyebrow="vi · cross-impl interop"
        title="Six runs. One hash."
        body="Different languages. Different teams. One canonical input. The conformance suite is the slowest-moving and most public commitment."
      />
    </div>
  );
}

// ============================================================ END CARD
function SceneEnd() {
  const { localTime, duration } = useSprite();
  const t = localTime;
  const fadeIn = Easing.easeOutCubic(clamp(t / 1.0, 0, 1));
  const ex = clamp((t - (duration - 0.6)) / 0.6, 0, 1);
  const op = fadeIn * (1 - ex);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: '0.4em', color: A_ACCENT, marginBottom: 36, textTransform: 'uppercase' }}>
        AEOESS · PROTOCOL
      </div>
      <div style={{ fontFamily: 'Fraunces', fontSize: 132, lineHeight: 1.0, color: A_INK, fontWeight: 400, letterSpacing: '-0.025em', textAlign: 'center', fontVariationSettings: '"opsz" 144' }}>
        from a person,<br/>
        <span style={{ fontStyle: 'italic', color: A_ACCENT }}>through a machine</span>,<br/>
        to a record.
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, letterSpacing: '0.2em', color: A_INK_3, marginTop: 56, textTransform: 'uppercase' }}>
        v0.3 · 6 implementations · 2,884 tests · public draft
      </div>
    </div>
  );
}

// expose to window
Object.assign(window, {
  SceneOpen, SceneOne, SceneTwo, SceneThree, SceneFour, SceneFive, SceneSix, SceneEnd
});
