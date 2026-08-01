// Shared helpers for KYA landings: animated atom/orbit, blueprint utils,
// typewriter, counters. Exported to window for cross-file babel scripts.

// ──────────────────────────────────────────────────────────
// Atomic orbit — animated SVG with rotating electrons.
// Used as a hero motif: an "agent" at the nucleus, identity claims
// orbiting (issuer, scope, expiry, audit, etc.)
// ──────────────────────────────────────────────────────────
function AtomicOrbit({ size = 520, stroke = '#5eead4', dim = 'rgba(94,234,212,0.18)', accent = '#5eead4', labels = [], nucleus = 'AGENT', font = 'JetBrains Mono', speed = 1 }) {
  const cx = size / 2, cy = size / 2;
  const orbits = [
    { rx: size * 0.46, ry: size * 0.18, rot: 0 },
    { rx: size * 0.46, ry: size * 0.18, rot: 60 },
    { rx: size * 0.46, ry: size * 0.18, rot: 120 },
  ];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="ao-nuc" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.06" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* outer faint rings */}
      {[0.95, 0.78, 0.62, 0.46, 0.32].map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={(size / 2) * s} fill="none" stroke={dim} strokeWidth="0.5" strokeDasharray={i % 2 ? '2 4' : ''} />
      ))}
      {/* nucleus glow */}
      <circle cx={cx} cy={cy} r={size * 0.18} fill="url(#ao-nuc)" />
      {/* orbits + electrons */}
      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={o.rx} ry={o.ry} fill="none" stroke={stroke} strokeWidth="0.9" strokeOpacity="0.55" />
          <circle r={5} fill={accent}>
            <animateMotion dur={`${8 / speed}s`} repeatCount="indefinite" begin={`${-i * 1.3}s`}
              path={`M ${cx + o.rx},${cy} a ${o.rx},${o.ry} 0 1,1 ${-2 * o.rx},0 a ${o.rx},${o.ry} 0 1,1 ${2 * o.rx},0`} />
          </circle>
        </g>
      ))}
      {/* labels positioned around the outermost ring */}
      {labels.map((lab, i) => {
        const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.48;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <g key={lab} transform={`translate(${x} ${y})`}>
            <circle r="3" fill={accent} />
            <text x="8" y="4" fill={accent} fontFamily={font} fontSize="11" fontWeight="500" letterSpacing="0.04em">{lab}</text>
          </g>
        );
      })}
      {/* nucleus chip */}
      <g>
        <rect x={cx - 44} y={cy - 14} width="88" height="28" rx="3" fill="#0a0e1a" stroke={accent} strokeOpacity="0.6" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={accent} fontFamily={font} fontSize="12" fontWeight="600" letterSpacing="0.18em">{nucleus}</text>
      </g>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// Network lattice — nodes & connecting lines with a flowing
// pulse along edges. Used as a secondary motif for "trust graph".
// ──────────────────────────────────────────────────────────
function NetworkLattice({ width = 800, height = 360, color = '#5eead4', density = 14, seed = 7 }) {
  // deterministic pseudo-random
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const nodes = Array.from({ length: density }, () => ({
    x: rnd() * width,
    y: rnd() * height,
  }));
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < width * 0.28) edges.push({ a: i, b: j, d });
    }
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      {edges.map((e, i) => (
        <line key={i}
          x1={nodes[e.a].x} y1={nodes[e.a].y} x2={nodes[e.b].x} y2={nodes[e.b].y}
          stroke={color} strokeOpacity={0.18 + (1 - e.d / (width * 0.28)) * 0.4} strokeWidth="0.6" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="2.4" fill={color} />
          {i % 3 === 0 && (
            <circle cx={n.x} cy={n.y} r="8" fill="none" stroke={color} strokeOpacity="0.6">
              <animate attributeName="r" from="3" to="22" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// Typewriter — cycles a list of strings for hero/headers.
// ──────────────────────────────────────────────────────────
function useTypewriter(items, { typeMs = 50, pauseMs = 1600, deleteMs = 28 } = {}) {
  const [text, setText] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const [phase, setPhase] = React.useState('typing'); // typing | pause | deleting
  React.useEffect(() => {
    const target = items[idx % items.length];
    let t;
    if (phase === 'typing') {
      if (text.length < target.length) t = setTimeout(() => setText(target.slice(0, text.length + 1)), typeMs);
      else t = setTimeout(() => setPhase('pause'), pauseMs);
    } else if (phase === 'pause') {
      t = setTimeout(() => setPhase('deleting'), pauseMs);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(target.slice(0, text.length - 1)), deleteMs);
      else { setIdx(i => i + 1); setPhase('typing'); }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, items, typeMs, pauseMs, deleteMs]);
  return text;
}

// ──────────────────────────────────────────────────────────
// Counter — number that animates from 0 to value on mount.
// ──────────────────────────────────────────────────────────
function Counter({ value, duration = 1400, format = (n) => n.toLocaleString() }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(n)}</>;
}

// ──────────────────────────────────────────────────────────
// AnimatedLog — terminal-style log lines that scroll in.
// ──────────────────────────────────────────────────────────
function AnimatedLog({ lines, color = '#5eead4', dim = 'rgba(255,255,255,0.5)', intervalMs = 900, font = 'JetBrains Mono' }) {
  const [shown, setShown] = React.useState(1);
  React.useEffect(() => {
    const id = setInterval(() => setShown(s => (s >= lines.length ? 1 : s + 1)), intervalMs);
    return () => clearInterval(id);
  }, [lines.length, intervalMs]);
  return (
    <div style={{ fontFamily: font, fontSize: 12, lineHeight: 1.7, color: dim }}>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, opacity: i === shown - 1 ? 1 : 0.65 }}>
          <span style={{ color: dim, width: 56, flex: 'none' }}>{String(i + 1).padStart(2, '0')}:{(34 + i * 7) % 60 < 10 ? '0' : ''}{(34 + i * 7) % 60}</span>
          <span style={{ color: l.includes('ALLOW') || l.includes('VERIFIED') || l.includes('OK') ? color : (l.includes('DENY') || l.includes('BLOCK') ? '#fb7185' : dim) }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Pulse — small breathing dot used as a "live" indicator.
// ──────────────────────────────────────────────────────────
function PulseDot({ color = '#5eead4', size = 8 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      <span style={{ position: 'absolute', inset: 0, background: color, borderRadius: '50%' }} />
      <span style={{ position: 'absolute', inset: 0, background: color, borderRadius: '50%', animation: 'kya-pulse 2.4s infinite' }} />
      <style>{`@keyframes kya-pulse{0%{transform:scale(1);opacity:.7}70%{transform:scale(3);opacity:0}100%{transform:scale(3);opacity:0}}`}</style>
    </span>
  );
}

// Export to window so other babel scripts see them.
Object.assign(window, { AtomicOrbit, NetworkLattice, useTypewriter, Counter, AnimatedLog, PulseDot });
