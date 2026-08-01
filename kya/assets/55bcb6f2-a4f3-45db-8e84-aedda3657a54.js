// Premium-minimal shared primitives for KYA landing directions.
// Soft gradients, thin protocol grids, signal waves, translucent nodes.

// ──────────────────────────────────────────────────────────
// Color tokens — soft palette for premium-light directions
// ──────────────────────────────────────────────────────────
const PX = {
  white: '#ffffff',
  paper: '#fbfbfd',
  paperBlue: '#f6f8fc',
  paperLavender: '#f5f3fb',
  paperCyan: '#f0f7fa',

  ink: '#0c1130',          // deep ink for primary text
  inkSoft: '#3d4570',
  inkDim: '#6b7299',
  inkFaint: '#a1a7c1',
  inkGhost: '#cdd2e0',

  border: 'rgba(45, 67, 130, 0.08)',
  borderSoft: 'rgba(45, 67, 130, 0.05)',
  borderStrong: 'rgba(45, 67, 130, 0.16)',
  gridLine: 'rgba(70, 90, 160, 0.06)',

  // accents
  blue: '#5b7af0',         // primary trust blue (calm)
  lavender: '#a298eb',     // soft lavender
  cyan: '#6ec5d9',         // muted cyan
  mint: '#7dc9b0',
  amber: '#d9a86c',
  rose: '#d98a8a',

  // tints
  blueTint: 'rgba(91,122,240,0.08)',
  lavenderTint: 'rgba(162,152,235,0.10)',
  cyanTint: 'rgba(110,197,217,0.10)',
};

PX.sansDisplay = '"Barlow Condensed", "Inter Tight", -apple-system, sans-serif';
PX.sans = '"Inter Tight", "Manrope", -apple-system, sans-serif';
PX.sansAlt = '"Manrope", "Inter Tight", sans-serif';
PX.mono = '"JetBrains Mono", "Geist Mono", ui-monospace, monospace';

// ──────────────────────────────────────────────────────────
// PXGradientBg — full-bleed soft gradient with optional grid
// ──────────────────────────────────────────────────────────
function PXGradientBg({ variant = 'aurora', children, grid = true, gridOpacity = 1 }) {
  const variants = {
    aurora: {
      bg: PX.white,
      blobs: [
        { x: '85%', y: '-10%', r: '60%', color: 'rgba(162, 152, 235, 0.22)' },
        { x: '-15%', y: '60%', r: '55%', color: 'rgba(91, 122, 240, 0.12)' },
        { x: '50%', y: '120%', r: '50%', color: 'rgba(110, 197, 217, 0.10)' },
      ],
    },
    glass: {
      bg: PX.white,
      blobs: [
        { x: '15%', y: '-20%', r: '55%', color: 'rgba(110, 197, 217, 0.16)' },
        { x: '95%', y: '50%', r: '40%', color: 'rgba(91, 122, 240, 0.10)' },
        { x: '60%', y: '110%', r: '50%', color: 'rgba(162, 152, 235, 0.12)' },
      ],
    },
    paper: {
      bg: PX.paper,
      blobs: [],
    },
    soft: {
      bg: PX.white,
      blobs: [
        { x: '50%', y: '-50%', r: '70%', color: 'rgba(91, 122, 240, 0.06)' },
      ],
    },
  };
  const v = variants[variant] || variants.aurora;
  return (
    <div style={{ position: 'relative', background: v.bg, overflow: 'hidden' }}>
      {v.blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x, top: b.y, width: b.r, aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      ))}
      {grid && <PXGrid opacity={gridOpacity} />}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PXGrid — thin protocol grid; only visible in a window
// ──────────────────────────────────────────────────────────
function PXGrid({ opacity = 1, size = 60, masked = true }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `
        linear-gradient(${PX.gridLine} 1px, transparent 1px),
        linear-gradient(90deg, ${PX.gridLine} 1px, transparent 1px)
      `,
      backgroundSize: `${size}px ${size}px`,
      ...(masked ? {
        maskImage: 'radial-gradient(ellipse 80% 70% at center, #000 30%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at center, #000 30%, transparent 90%)',
      } : {}),
    }} />
  );
}

// ──────────────────────────────────────────────────────────
// PXSignalWave — thin animated wave path representing activity.
// Calm, single-line, no fill. Can scroll continuously.
// ──────────────────────────────────────────────────────────
function PXSignalWave({ color = PX.blue, height = 200, amplitude = 24, frequency = 0.012, animate = true, opacity = 0.7, strokeWidth = 1 }) {
  const W = 1440;
  // Build a long path covering 2W so we can translate by -W for a seamless loop
  const buildPath = (offset = 0) => {
    const points = [];
    for (let x = 0; x <= W * 2; x += 6) {
      const y = height / 2
        + Math.sin((x + offset) * frequency) * amplitude
        + Math.sin((x + offset) * frequency * 2.3 + 1.2) * amplitude * 0.35;
      points.push(`${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(2)}`);
    }
    return points.join(' ');
  };
  const path = buildPath();
  return (
    <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`pxwg-${color.replace('#','')}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset="0.15" stopColor={color} stopOpacity={opacity} />
          <stop offset="0.85" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform={animate ? '' : 'translate(0,0)'}>
        <path d={path} fill="none" stroke={`url(#pxwg-${color.replace('#','')})`} strokeWidth={strokeWidth} strokeLinecap="round">
          {animate && <animateTransform attributeName="transform" type="translate" from="0 0" to={`-${W} 0`} dur="22s" repeatCount="indefinite" />}
        </path>
      </g>
      {/* Light tick markers along the wave */}
      {animate && Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} r="3" fill={color} opacity={0.6}>
          <animateMotion dur={`${8 + i * 1.5}s`} begin={`${-i * 1.6}s`} repeatCount="indefinite" path={path} />
        </circle>
      ))}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// PXIdentityOrbit — translucent identity-node atom
// Premium-minimal alternative to the AtomicOrbit. Soft strokes,
// glassy nucleus, gentle electron motion.
// ──────────────────────────────────────────────────────────
function PXIdentityOrbit({ size = 480, palette = 'aurora', labels = [], nucleus = 'AGENT', subline = 'verified · v1.0' }) {
  const cx = size / 2, cy = size / 2;
  const colors = palette === 'glass'
    ? { stroke: PX.cyan, glow1: 'rgba(110,197,217,0.22)', glow2: 'rgba(91,122,240,0.12)', dot: PX.cyan, label: PX.inkSoft }
    : { stroke: PX.lavender, glow1: 'rgba(162,152,235,0.22)', glow2: 'rgba(91,122,240,0.12)', dot: PX.blue, label: PX.inkSoft };
  const orbits = [
    { rx: size * 0.46, ry: size * 0.18, rot: 0 },
    { rx: size * 0.46, ry: size * 0.18, rot: 60 },
    { rx: size * 0.46, ry: size * 0.18, rot: 120 },
  ];
  const uid = `px-orb-${palette}`;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={colors.glow1} />
          <stop offset="50%" stopColor={colors.glow2} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={`${uid}-nucleus`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor={colors.glow1} />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {/* outer faint glow */}
      <circle cx={cx} cy={cy} r={size * 0.5} fill={`url(#${uid}-glow)`} />
      {/* outer faint rings */}
      {[0.96, 0.78, 0.62, 0.46, 0.30].map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={(size / 2) * s} fill="none" stroke={colors.stroke} strokeOpacity="0.18" strokeWidth="0.7" strokeDasharray={i % 2 ? '2 5' : ''} />
      ))}
      {/* orbits */}
      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={o.rx} ry={o.ry} fill="none" stroke={colors.stroke} strokeOpacity="0.45" strokeWidth="0.8" />
          <circle r="4" fill={colors.dot}>
            <animateMotion dur={`${10 + i * 2}s`} repeatCount="indefinite" begin={`${-i * 1.6}s`}
              path={`M ${cx + o.rx},${cy} a ${o.rx},${o.ry} 0 1,1 ${-2 * o.rx},0 a ${o.rx},${o.ry} 0 1,1 ${2 * o.rx},0`} />
            <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* labels positioned around the outer ring */}
      {labels.map((lab, i) => {
        const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.50;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <g key={lab} transform={`translate(${x} ${y})`}>
            <circle r="2.5" fill={colors.dot} />
            <text x={Math.cos(a) >= 0 ? 8 : -8} y="3" fill={colors.label} fontFamily={PX.mono} fontSize="10" fontWeight="500" letterSpacing="0.18em" textAnchor={Math.cos(a) >= 0 ? 'start' : 'end'}>{lab}</text>
          </g>
        );
      })}
      {/* nucleus */}
      <circle cx={cx} cy={cy} r={size * 0.13} fill={`url(#${uid}-nucleus)`} />
      <circle cx={cx} cy={cy} r={size * 0.10} fill="none" stroke={colors.stroke} strokeOpacity="0.5" />
      <text x={cx} y={cy - 2} textAnchor="middle" fill={PX.ink} fontFamily={PX.sansDisplay} fontSize="22" fontWeight="500" letterSpacing="0.18em">{nucleus}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={PX.inkDim} fontFamily={PX.mono} fontSize="9" letterSpacing="0.2em">{subline}</text>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// PXSpec — small uppercase mono label for sections
// ──────────────────────────────────────────────────────────
function PXSpec({ k, n }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: PX.mono, fontSize: 11, color: PX.inkDim, letterSpacing: '0.24em' }}>
      <span style={{ width: 24, height: 1, background: PX.borderStrong }} />
      <span style={{ color: PX.blue }}>{n}</span>
      <span>{k.toUpperCase()}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PXTranslucentCard — large rounded rectangle, glassmorphic
// ──────────────────────────────────────────────────────────
function PXTranslucentCard({ children, style = {}, hue = 'lavender' }) {
  const tints = {
    lavender: `linear-gradient(160deg, rgba(255,255,255,0.7), rgba(245,243,251,0.5))`,
    cyan: `linear-gradient(160deg, rgba(255,255,255,0.7), rgba(240,247,250,0.5))`,
    blue: `linear-gradient(160deg, rgba(255,255,255,0.7), rgba(246,248,252,0.5))`,
  };
  return (
    <div style={{
      background: tints[hue] || tints.lavender,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${PX.border}`,
      borderRadius: 24,
      boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 30px 60px -40px rgba(45,67,130,0.18)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// PXPill — small status pill
// ──────────────────────────────────────────────────────────
function PXPill({ children, color = PX.blue, bg = 'rgba(91,122,240,0.10)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
      borderRadius: 999, background: bg, color,
      fontFamily: PX.mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ──────────────────────────────────────────────────────────
// PXButton — primary/ghost
// ──────────────────────────────────────────────────────────
function PXButton({ children, variant = 'primary', size = 'md', style = {}, ...rest }) {
  const sizes = { md: '13px 24px', lg: '16px 30px', sm: '10px 18px' };
  const variants = {
    primary: { background: PX.ink, color: PX.white, border: 'none' },
    ghost: { background: 'transparent', color: PX.ink, border: `1px solid ${PX.borderStrong}` },
    soft: { background: PX.paperBlue, color: PX.ink, border: `1px solid ${PX.border}` },
  };
  return (
    <button style={{
      ...variants[variant],
      padding: sizes[size] || sizes.md,
      fontFamily: PX.sans,
      fontSize: size === 'lg' ? 15 : 14,
      fontWeight: 500,
      borderRadius: 999,
      cursor: 'pointer',
      letterSpacing: '0.005em',
      ...style,
    }} {...rest}>{children}</button>
  );
}

// ──────────────────────────────────────────────────────────
// PXBreathingDot — calm pulse indicator
// ──────────────────────────────────────────────────────────
function PXBreathingDot({ color = PX.blue, size = 8 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
      <span style={{ position: 'absolute', inset: 0, background: color, borderRadius: '50%' }} />
      <span style={{ position: 'absolute', inset: 0, background: color, borderRadius: '50%', animation: 'px-breath 2.6s infinite ease-out' }} />
      <style>{`@keyframes px-breath{0%{transform:scale(1);opacity:.55}80%{transform:scale(2.6);opacity:0}100%{transform:scale(2.6);opacity:0}}`}</style>
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// PXLogo — refined wordmark glyph (concentric + dot)
// ──────────────────────────────────────────────────────────
function PXLogo({ size = 28, color1 = PX.blue, color2 = PX.lavender }) {
  const uid = `px-logo-${color1.replace('#','')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="none" stroke={`url(#${uid})`} strokeWidth="1.2" />
      <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke={`url(#${uid})`} strokeWidth="1" transform="rotate(-30 16 16)" opacity="0.7" />
      <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke={`url(#${uid})`} strokeWidth="1" transform="rotate(30 16 16)" opacity="0.4" />
      <circle cx="16" cy="16" r="3.4" fill={`url(#${uid})`} />
    </svg>
  );
}

Object.assign(window, {
  PX, PXGradientBg, PXGrid, PXSignalWave, PXIdentityOrbit, PXSpec,
  PXTranslucentCard, PXPill, PXButton, PXBreathingDot, PXLogo,
});
