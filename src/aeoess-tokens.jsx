// aeoess-tokens.jsx
// Shared design tokens + base UI for the three landing-page directions.
// Tokens are exact mirrors of the aeoess_web shared.css per brief.

const AEOESS_LIGHT = {
  bg:'#ffffff', paper:'#fafaf8', surface:'#f4f4f2', surface2:'#eeeeed',
  ink:'#0a0a0a', ink2:'#1a1a1a', ink3:'#333333', ink4:'#555555', ink5:'#888888',
  rule:'#bbbbbb', ruleLight:'#dddddd',
  link:'#2563eb', linkHover:'#1d4ed8',
  codeBg:'#f3f3f1',
  green:'#166534', blue:'#1e40af', red:'#b91c1c',
};
const AEOESS_DARK = {
  bg:'#1c1c1e', paper:'#242426', surface:'#2a2a2e', surface2:'#323236',
  ink:'#ececec', ink2:'#dddddd', ink3:'#b0b0b0', ink4:'#8a8a8e', ink5:'#5a5a5e',
  rule:'#3a3a3e', ruleLight:'#2e2e32',
  link:'#93c5fd', linkHover:'#bfdbfe',
  codeBg:'#28282c',
  green:'#4ade80', blue:'#60a5fa', red:'#f87171',
};

// Returns the active palette + the chosen accent color resolved against the palette.
function aeoessPalette({ dark, accent }) {
  const p = dark ? AEOESS_DARK : AEOESS_LIGHT;
  let accentColor = p.green;
  if (accent === 'ink') accentColor = p.ink;
  else if (accent === 'blue') accentColor = p.blue;
  return { ...p, accentColor };
}

// Heads up: the four buyer-category copy decks.
// Refined from the brief; kept tight enough to fit a card without truncation.
const SOLUTIONS = [
  {
    id:'payments', title:'Payments',
    tag:'For fintech, marketplaces, B2B commerce',
    pitch:'Let agents spend money under cryptographic limits.',
    body:'Six rails, a four-gate spending policy, signed payment receipts. Every transaction carries the delegation that authorized it.',
  },
  {
    id:'content', title:'Content',
    tag:'For publishers, data providers, IP owners',
    pitch:'License your content to AI without losing control.',
    body:'Governance blocks, signed access receipts, and revocation that propagates through derivatives. Your terms travel with the bytes.',
  },
  {
    id:'compliance', title:'Compliance',
    tag:'For regulated industries and EU operators',
    pitch:'Prove every agent action under your regulator.',
    body:'Eight governance primitives mapped to EU AI Act, NIST AI RMF, ISO 42001, and SR 11-7. Auditors verify receipts without going through us.',
  },
  {
    id:'enterprise', title:'Enterprise',
    tag:'For internal agent fleets and platform teams',
    pitch:'Run internal agent fleets with full audit.',
    body:'Bring your own identity formats: did:key, did:web, SPIFFE, OAuth. Policy enforcement at action time, signed audit trail by default.',
  },
];

// Minimal line icons rendered to currentColor, flat fill style matches
// the icon option Tima picked (filled square with cutout dot).
function SolutionIcon({ id, size = 22 }) {
  const s = size;
  const stroke = { stroke:'currentColor', strokeWidth:1.4, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  switch (id) {
    case 'payments':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <rect x="3" y="6" width="18" height="13" rx="2"/>
          <path d="M3 10h18"/>
          <path d="M7 15h3"/>
        </svg>
      );
    case 'content':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <path d="M6 3h9l4 4v14H6z"/>
          <path d="M15 3v4h4"/>
          <path d="M9 12h7M9 16h5"/>
        </svg>
      );
    case 'compliance':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      );
    case 'enterprise':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <rect x="3" y="9" width="7" height="11" rx="1"/>
          <rect x="14" y="4" width="7" height="16" rx="1"/>
          <path d="M5.5 13h2M5.5 16h2M16.5 8h2M16.5 11h2M16.5 14h2"/>
        </svg>
      );
    default: return null;
  }
}

// Aeoess-style logomark, flat ink, paired with wordmark in directions where
// the layout allows it. The actual site uses an "AEOESS" wordmark in caps;
// we reproduce that, with the leading O slightly offset as a visual nod to
// the architecture viz nodes.
function AeoessMark({ size = 22, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="4" fill={color || 'currentColor'}/>
      <circle cx="14" cy="12" r="4" fill="none" stroke={color || 'currentColor'} strokeWidth="1.4"/>
      <circle cx="14" cy="12" r="1.4" fill={color || 'currentColor'}/>
    </svg>
  );
}

// Architecture-viz mock. A subtle, animated representation of the protocol:
// principal -> delegation -> agent -> action receipts. Hovering a node
// highlights the path. Designed to read as "this would be a live iframe".
function ArchitectureMock({ palette, height = 380 }) {
  const [hover, setHover] = React.useState('agent');
  const P = palette;
  const nodeFill = P.paper;
  const nodeStroke = P.rule;
  const dim = (id) => hover && hover !== id;

  // Five nodes laid out left-to-right with two parallel signing paths.
  const nodes = [
    { id:'principal', x:90,  y:190, label:'Principal',   sub:'human / org' },
    { id:'passport',  x:280, y:120, label:'Passport',    sub:'identity' },
    { id:'delegation',x:280, y:260, label:'Delegation',  sub:'scope · spend · sunset' },
    { id:'agent',     x:500, y:190, label:'Agent',       sub:'acts on your behalf' },
    { id:'gateway',   x:720, y:120, label:'Gateway',     sub:'policy enforcement' },
    { id:'receipt',   x:720, y:260, label:'Receipt',     sub:'signed audit' },
  ];
  const edges = [
    ['principal','passport'],
    ['principal','delegation'],
    ['passport','agent'],
    ['delegation','agent'],
    ['agent','gateway'],
    ['agent','receipt'],
  ];
  const idx = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div style={{ position:'relative', width:'100%', height, background:P.paper, border:`1px solid ${P.ruleLight}`, borderRadius:6, overflow:'hidden' }}>
      {/* faint grid for "live system" texture */}
      <div style={{ position:'absolute', inset:0,
        backgroundImage:`linear-gradient(${P.ruleLight} 1px, transparent 1px), linear-gradient(90deg, ${P.ruleLight} 1px, transparent 1px)`,
        backgroundSize:'40px 40px', opacity:.35, maskImage:'radial-gradient(ellipse at center, #000 30%, transparent 80%)' }}/>
      <svg viewBox="0 0 820 380" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{ position:'relative' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={P.ink4}/>
          </marker>
          <marker id="arrowAccent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={P.accentColor}/>
          </marker>
        </defs>

        {edges.map(([a,b]) => {
          const A = idx[a], B = idx[b];
          const active = !hover || hover === a || hover === b;
          return (
            <g key={a+'-'+b} opacity={active ? 1 : .25}>
              <line x1={A.x+58} y1={A.y} x2={B.x-58} y2={B.y}
                stroke={active && hover ? P.accentColor : P.ink4}
                strokeWidth={active && hover ? 1.6 : 1}
                strokeDasharray="4 4"
                markerEnd={active && hover ? 'url(#arrowAccent)' : 'url(#arrow)'}>
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.2s" repeatCount="indefinite"/>
              </line>
            </g>
          );
        })}

        {nodes.map(n => {
          const active = hover === n.id;
          const dimmed = dim(n.id);
          return (
            <g key={n.id}
               onMouseEnter={() => setHover(n.id)}
               onMouseLeave={() => setHover('agent')}
               style={{ cursor:'default' }}
               opacity={dimmed ? .5 : 1}>
              <rect x={n.x-58} y={n.y-30} width="116" height="60" rx="4"
                fill={nodeFill}
                stroke={active ? P.accentColor : nodeStroke}
                strokeWidth={active ? 1.5 : 1}/>
              <text x={n.x} y={n.y-4} textAnchor="middle" fontSize="13" fontWeight="600" fill={P.ink}>
                {n.label}
              </text>
              <text x={n.x} y={n.y+14} textAnchor="middle" fontSize="10.5" fill={P.ink4}>
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* corner labels for the two signing paths */}
        <text x={400} y={70} textAnchor="middle" fontSize="10.5" fill={P.ink5} letterSpacing="0.08em">IDENTITY PATH</text>
        <text x={400} y={335} textAnchor="middle" fontSize="10.5" fill={P.ink5} letterSpacing="0.08em">DELEGATION PATH</text>
      </svg>
    </div>
  );
}

// Pull quote + proof points used in the "Recognized by" section. Real items
// per brief; placeholders are clearly marked so Tima can swap.
const PROOF = [
  { kind:'cite', label:'Cited in', body:'University of British Columbia paper on Personal Data Repositories' },
  { kind:'cite', label:'Integration', body:'Microsoft Agent Toolkit, PR in review' },
  { kind:'cite', label:'Federal', body:'NIST NCCoE concept paper submitted' },
  { kind:'cite', label:'Ecosystem', body:'Active integrations with peer protocols' },
];

Object.assign(window, {
  AEOESS_LIGHT, AEOESS_DARK, aeoessPalette,
  SOLUTIONS, SolutionIcon, AeoessMark, ArchitectureMock, PROOF,
});
