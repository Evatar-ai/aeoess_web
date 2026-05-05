/* ════════════════════════════════════════════════════════════════════
   roadmap.js — interactive timeline + list + detail panel
   ────────────────────────────────────────────────────────────────────
   No build step, no framework. Reads `roadmap.yaml` (or falls back to
   `data/items.json` for offline preview). Renders an SVG Gantt + a list
   view + a detail panel. Filters live, search live, theme-aware.
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ───────── Config ─────────
  const DAY_ONE = new Date('2026-02-17');
  const TODAY_DAY = Math.max(1, Math.floor((Date.now() - DAY_ONE) / 86400000) + 1);

  // 7-lane taxonomy. Order = top-to-bottom on timeline.
  const LANE_ORDER = ['protocol', 'product', 'payments', 'standards', 'research', 'ecosystem', 'ops'];
  const LANE_LABELS = {
    protocol:   'Protocol',
    product:    'Product',
    payments:   'Payments',
    standards:  'Standards',
    research:   'Research',
    ecosystem:  'Ecosystem',
    ops:        'Ops',
  };

  // Map legacy lane values to new lanes (so the redesign works against the
  // unmigrated yaml on day 1, before MIGRATION.md re-tag pass runs).
  const LEGACY_LANE_MAP = {
    comms:      'ops',         // catch-all for narrative comms
    vocab:      'standards',
    docs:       'standards',
    infra:      'ops',
    unassigned: 'ops',
  };

  // Heuristic re-classifier for items whose stored workstream lands in the
  // catch-all but whose title clearly belongs elsewhere. Mirrors MIGRATION.md
  // rules 1–4. This is a safety net; the proper fix is the yaml re-tag.
  const PAYMENTS_RE = /\b(x402|ap2|acp|mpp|stripe|mnemopay|merchant|commerce|payment|paid-|registry|rail)\b/i;
  const STANDARDS_RE = /\b(ietf|a2a[#-]?\d|aaif|nist|nccoe|owasp|dif[#-]|erc[-]?8004|in-toto|vocab|crosswalk|conformance|normative|appendix|wg[#-]|working group|caisi|spec)\b/i;
  const ECOSYSTEM_RE = /\b(partner|interop|qntm|agentgraph|foxbook|agentid|nobulex|moltrust|moltycel|ecosystem|crosswalk merged|pr #\d+ merged)\b/i;

  function reclassifyLane(item) {
    const ws = (item.workstream || '').toLowerCase();
    const text = (item.title || '') + ' ' + (item.description || item.desc || '');
    // 1. Honour an explicit modern lane.
    if (LANE_ORDER.includes(ws)) return ws;
    // 2. Pattern-match payments / standards / ecosystem before falling through.
    if (PAYMENTS_RE.test(text)) return 'payments';
    if (STANDARDS_RE.test(text)) return 'standards';
    if (ECOSYSTEM_RE.test(text) && ws === 'comms') return 'ecosystem';
    // 3. Map legacy buckets to a default modern lane.
    if (LEGACY_LANE_MAP[ws]) return LEGACY_LANE_MAP[ws];
    // 4. Last resort.
    return 'ops';
  }

  // ───────── Geometry ─────────
  const LABEL_W = 100;
  const TOP_PAD = 56;
  const BOT_PAD = 18;
  const LANE_PAD = 8;
  const BAR_H = 18;
  const BAR_GAP = 4;
  const MIN_BAR_W = 8;       // Min visible bar width
  const HIT_PAD_W = 16;       // Extra px each side of bar for click target

  // Day-pixel scale. Adapts to viewport: tighter on mobile.
  function dayPx() {
    const w = window.innerWidth;
    if (w < 640) return 14;
    if (w < 1024) return 22;
    return 28;
  }

  // ───────── State ─────────
  const state = {
    items: [],
    filtered: [],
    laneCounts: {},
    statusCounts: {},
    filters: { status: 'all', lane: 'all', q: '' },
    view: 'timeline',
    focusId: null,
    layout: null, // computed timeline layout
  };

  // ───────── Boot ─────────
  document.addEventListener('DOMContentLoaded', boot);

  async function boot() {
    try {
      state.items = await loadItems();
    } catch (err) {
      console.error('[roadmap] load failed', err);
      showLoadError();
      return;
    }

    // Normalize each item: lane + status + dates.
    state.items = state.items
      .filter(i => i && i.id)
      .map(i => {
        const lane = reclassifyLane(i);
        const status = (i.status || '').toLowerCase();
        const ds = +i.day_start || 1;
        const de = +(i.day_end || i.day_start) || ds;
        return Object.assign({}, i, {
          _lane: lane,
          _status: status || 'unspecified',
          _ds: ds,
          _de: Math.max(ds, de),
          _desc: i.description || i.desc || '',
          _searchBlob: ((i.title || '') + ' ' + (i.description || i.desc || '')).toLowerCase(),
        });
      });

    indexCounts();
    renderHeroStats();
    renderLaneChips();
    bindFilters();
    bindDetailPanel();
    bindViewToggle();
    bindKeyboard();
    applyFilters();

    // SVG hydrated successfully — hide build-rendered static fallback so we
    // don't show the same content twice.
    const stat = document.getElementById('rm-static');
    if (stat) stat.style.display = 'none';
  }

  async function loadItems() {
    // Primary: roadmap.yaml at site root (production path)
    try {
      const r = await fetch('roadmap.yaml');
      if (r.ok && window.jsyaml) {
        const txt = await r.text();
        const parsed = window.jsyaml.load(txt);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    // Fallback: data/items.json (offline preview, design project)
    const r2 = await fetch('data/items.json');
    if (!r2.ok) throw new Error('No data source available');
    return r2.json();
  }

  function showLoadError() {
    const svg = document.getElementById('rm-timeline-svg');
    if (svg) {
      svg.innerHTML = '<text x="20" y="40" style="font:1rem var(--sans);fill:var(--red)">Interactive timeline unavailable. Static roadmap below.</text>';
    }
    const stat = document.getElementById('rm-static');
    if (stat) stat.classList.add('rm-static-show');
  }

  // ───────── Indexing ─────────
  function indexCounts() {
    state.laneCounts = {};
    state.statusCounts = { all: state.items.length };
    LANE_ORDER.forEach(l => state.laneCounts[l] = 0);
    state.items.forEach(i => {
      state.laneCounts[i._lane] = (state.laneCounts[i._lane] || 0) + 1;
      const sk = i._status === 'in_progress' ? 'active' : i._status;
      state.statusCounts[sk] = (state.statusCounts[sk] || 0) + 1;
    });
  }

  // ───────── Hero stats ─────────
  function renderHeroStats() {
    const total = state.items.length;
    const shipped = state.items.filter(i => i._status === 'done').length;
    const active = state.items.filter(i => i._status === 'active' || i._status === 'in_progress').length;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-shipped').textContent = shipped;
    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-day').textContent = TODAY_DAY;
    // Update the search placeholder + result count default
    const search = document.getElementById('rm-search');
    if (search) search.placeholder = 'Search ' + total + ' items by title or description…';
  }

  // ───────── Lane chips ─────────
  function renderLaneChips() {
    const host = document.getElementById('rm-lane-chips');
    if (!host) return;
    LANE_ORDER.forEach(lane => {
      const count = state.laneCounts[lane] || 0;
      if (count === 0) return; // hide empty lanes from the chip row
      const btn = document.createElement('button');
      btn.className = 'rm-chip';
      btn.dataset.lane = lane;
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = LANE_LABELS[lane] + ' <span class="rm-chip-count">' + count + '</span>';
      host.appendChild(btn);
    });
  }

  // ───────── Filter binding ─────────
  function bindFilters() {
    document.querySelectorAll('[data-status]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-status]').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        state.filters.status = b.dataset.status;
        applyFilters();
      });
    });
    // Default: All status active
    document.querySelector('[data-status="all"]')?.classList.add('active');

    document.getElementById('rm-lane-chips').addEventListener('click', (e) => {
      const b = e.target.closest('[data-lane]');
      if (!b) return;
      document.querySelectorAll('[data-lane]').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
      state.filters.lane = b.dataset.lane;
      applyFilters();
    });
    document.querySelector('[data-lane="all"]')?.classList.add('active');

    const search = document.getElementById('rm-search');
    const clear = document.getElementById('rm-search-clear');
    let to;
    search.addEventListener('input', () => {
      clearTimeout(to);
      to = setTimeout(() => {
        state.filters.q = search.value.trim().toLowerCase();
        clear.classList.toggle('visible', !!state.filters.q);
        applyFilters();
      }, 90);
    });
    clear.addEventListener('click', () => {
      search.value = '';
      state.filters.q = '';
      clear.classList.remove('visible');
      applyFilters();
      search.focus();
    });
  }

  function applyFilters() {
    const { status, lane, q } = state.filters;
    state.filtered = state.items.filter(i => {
      if (status !== 'all') {
        const sk = i._status === 'in_progress' ? 'active' : i._status;
        if (sk !== status) return false;
      }
      if (lane !== 'all' && i._lane !== lane) return false;
      if (q && !i._searchBlob.includes(q)) return false;
      return true;
    });
    document.getElementById('rm-count-shown').textContent = state.filtered.length;
    if (state.view === 'timeline') renderTimeline();
    else renderList();
  }

  // ───────── View toggle ─────────
  function bindViewToggle() {
    document.querySelectorAll('.rm-view-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.rm-view-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        state.view = b.dataset.view;
        const tl = document.getElementById('rm-timeline-section');
        const li = document.getElementById('rm-list-section');
        if (state.view === 'timeline') { tl.style.display = ''; li.style.display = 'none'; renderTimeline(); }
        else { tl.style.display = 'none'; li.style.display = ''; renderList(); }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //   TIMELINE
  // ═══════════════════════════════════════════════════════════════════
  function renderTimeline() {
    const svg = document.getElementById('rm-timeline-svg');
    if (!svg) return;

    const visible = state.filtered;
    const allVisible = state.items;
    if (visible.length === 0) {
      svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" style="font:1rem var(--serif); fill:var(--ink-4)">No items match these filters.</text>';
      svg.setAttribute('width', 800); svg.setAttribute('height', 200);
      svg.setAttribute('viewBox', '0 0 800 200');
      return;
    }

    const DAY_W = dayPx();

    // Day range: from Day 1 to max-day-end + 30 (give headroom).
    let maxDay = 30;
    state.items.forEach(i => { if (i._de > maxDay) maxDay = i._de; });
    const minDay = 1;
    const totalDays = maxDay - minDay + 1;

    // Per-lane stacking — only count visible items but reserve row space for
    // dimmed (non-matching) items so the timeline structure doesn't reflow on
    // every keystroke. Using all items keeps the layout stable.
    const visibleIds = new Set(visible.map(i => i.id));
    const lanes = {};
    LANE_ORDER.forEach(l => {
      const laneItems = state.items
        .filter(i => i._lane === l)
        .sort((a, b) => a._ds - b._ds);
      // Greedy interval stacking
      const rows = []; // rows[r] = last day_end placed in row r
      laneItems.forEach(it => {
        let placed = false;
        for (let r = 0; r < rows.length; r++) {
          if (it._ds > rows[r]) {
            it._row = r;
            rows[r] = it._de;
            placed = true;
            break;
          }
        }
        if (!placed) {
          it._row = rows.length;
          rows.push(it._de);
        }
      });
      lanes[l] = { items: laneItems, rowCount: Math.max(1, rows.length) };
    });

    // Lane Y positions
    const laneY = {};
    let cursor = TOP_PAD;
    LANE_ORDER.forEach(l => {
      if (lanes[l].rowCount === 0 || (state.laneCounts[l] || 0) === 0) {
        laneY[l] = null;
        return;
      }
      laneY[l] = cursor;
      lanes[l].height = lanes[l].rowCount * (BAR_H + BAR_GAP) + LANE_PAD * 2;
      cursor += lanes[l].height;
    });
    const totalH = cursor + BOT_PAD;
    const totalW = LABEL_W + totalDays * DAY_W + 20;

    state.layout = { lanes, laneY, DAY_W, minDay, maxDay, totalW, totalH };

    svg.setAttribute('width', totalW);
    svg.setAttribute('height', totalH);
    svg.setAttribute('viewBox', `0 0 ${totalW} ${totalH}`);

    let parts = [];

    // ── Defs ──
    parts.push(`<defs>
      <marker id="dep-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <polygon points="0 0,6 3,0 6" fill="var(--rule)" opacity=".7"/>
      </marker>
      <marker id="dep-arr-on" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <polygon points="0 0,6 3,0 6" fill="var(--blue)"/>
      </marker>
    </defs>`);

    // ── Lane backgrounds + labels ──
    let laneIdx = 0;
    LANE_ORDER.forEach(l => {
      if (laneY[l] == null) return;
      const y = laneY[l];
      const h = lanes[l].height;
      parts.push(`<rect class="lane-bg ${laneIdx % 2 ? 'alt' : ''}" x="0" y="${y}" width="${totalW}" height="${h}"/>`);
      parts.push(`<text class="lane-label" x="${LABEL_W - 14}" y="${y + 18}" text-anchor="end">${LANE_LABELS[l]}</text>`);
      parts.push(`<text class="lane-count" x="${LABEL_W - 14}" y="${y + 32}" text-anchor="end">${state.laneCounts[l]} items</text>`);
      laneIdx++;
    });

    // ── Day grid ──
    // Tick every 7 days; month label at first of each calendar month.
    for (let d = minDay; d <= maxDay; d++) {
      const x = LABEL_W + (d - minDay) * DAY_W;
      const isWeek = (d - 1) % 7 === 0;
      if (isWeek) {
        parts.push(`<line class="day-tick" x1="${x}" y1="${TOP_PAD - 8}" x2="${x}" y2="${totalH - BOT_PAD}"/>`);
      }
      // Month label
      const date = new Date(DAY_ONE.getTime() + (d - 1) * 86400000);
      if (date.getDate() === 1) {
        parts.push(`<line class="month-tick" x1="${x}" y1="${TOP_PAD - 12}" x2="${x}" y2="${totalH - BOT_PAD}"/>`);
        const m = date.toLocaleString('en', { month: 'short' });
        parts.push(`<text class="month-label" x="${x + 4}" y="${TOP_PAD - 22}">${m} ${date.getFullYear()}</text>`);
      }
      // Day number every 14 days
      if (isWeek && (d - 1) % 14 === 0) {
        parts.push(`<text class="day-label" x="${x + 2}" y="${TOP_PAD - 6}">d${d}</text>`);
      }
    }

    // ── Today line ──
    if (TODAY_DAY >= minDay && TODAY_DAY <= maxDay) {
      const tx = LABEL_W + (TODAY_DAY - minDay) * DAY_W;
      parts.push(`<line class="today-line" x1="${tx}" y1="${TOP_PAD - 14}" x2="${tx}" y2="${totalH - BOT_PAD}"/>`);
      parts.push(`<text class="today-label" x="${tx + 6}" y="${TOP_PAD - 38}">Today · d${TODAY_DAY}</text>`);
    }

    // ── Bars ──
    const idMap = new Map(state.items.map(i => [i.id, i]));
    const barPositions = new Map(); // id → { cx, cy } for dep arrows
    LANE_ORDER.forEach(l => {
      if (laneY[l] == null) return;
      lanes[l].items.forEach(it => {
        const x = LABEL_W + (it._ds - minDay) * DAY_W;
        const span = it._de - it._ds + 1;
        let w = Math.max(MIN_BAR_W, span * DAY_W - 2);
        const y = laneY[l] + LANE_PAD + it._row * (BAR_H + BAR_GAP);
        const dim = !visibleIds.has(it.id);
        const focused = it.id === state.focusId;
        const klass = ['bar'];
        if (dim) klass.push('dim');
        if (focused) klass.push('focus');
        const titleAttr = escapeAttr(it.title || it.id);

        // Hit-extender (transparent rect, larger than bar) for thin items
        const hitX = x - HIT_PAD_W;
        const hitW = w + HIT_PAD_W * 2;
        parts.push(
          `<g class="${klass.join(' ')}" data-id="${escapeAttr(it.id)}" tabindex="0" role="button" aria-label="${titleAttr}">` +
            `<rect class="bar-hit" x="${hitX}" y="${y - 4}" width="${hitW}" height="${BAR_H + 8}"/>` +
            `<rect class="bar-rect ${cssStatus(it._status)}" x="${x}" y="${y}" width="${w}" height="${BAR_H}" rx="2"/>` +
            (w > 60 ? `<text class="bar-label ${darkLabel(it._status) ? 'dark-on-light' : ''}" x="${x + 7}" y="${y + 12}">${escapeHtml(truncate(it.title || it.id, Math.floor(w / 6)))}</text>` : '') +
          `</g>`
        );
        barPositions.set(it.id, { x, y, w, h: BAR_H, cx: x + w / 2, cy: y + BAR_H / 2, right: x + w, left: x });
      });
    });

    // ── Dependency arrows ──
    const depParts = [];
    state.items.forEach(it => {
      if (!Array.isArray(it.deps) && !Array.isArray(it.dependencies)) return;
      const deps = it.deps || it.dependencies || [];
      deps.forEach(depId => {
        const a = barPositions.get(depId);
        const b = barPositions.get(it.id);
        if (!a || !b) return;
        const path = `M ${a.right} ${a.cy} C ${a.right + 18} ${a.cy} ${b.left - 18} ${b.cy} ${b.left} ${b.cy}`;
        const focused = state.focusId && (state.focusId === it.id || state.focusId === depId);
        depParts.push(`<path class="dep-arrow ${focused ? 'related' : ''}" d="${path}" marker-end="url(#${focused ? 'dep-arr-on' : 'dep-arr'})"/>`);
      });
    });
    // Insert dep arrows BEFORE bars so they sit underneath, except focused ones above.
    parts.splice(2, 0, depParts.filter(p => !p.includes('related')).join(''));
    parts.push(depParts.filter(p => p.includes('related')).join(''));

    svg.innerHTML = parts.join('');
    bindBarEvents(svg);

    // Auto-scroll to today on first paint
    requestAnimationFrame(() => {
      const scroll = document.getElementById('rm-timeline-scroll');
      if (scroll && !scroll._scrolledOnce) {
        scrollToToday(false);
        scroll._scrolledOnce = true;
      }
    });
  }

  function bindBarEvents(svg) {
    svg.querySelectorAll('g.bar').forEach(g => {
      const id = g.dataset.id;
      g.addEventListener('click', (e) => { e.stopPropagation(); openDetail(id); });
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(id); }
      });
    });
  }

  function scrollToToday(smooth) {
    const scroll = document.getElementById('rm-timeline-scroll');
    if (!scroll || !state.layout) return;
    const tx = LABEL_W + (TODAY_DAY - state.layout.minDay) * state.layout.DAY_W;
    const target = Math.max(0, tx - scroll.clientWidth / 2);
    scroll.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rm-today-jump')?.addEventListener('click', () => scrollToToday(true));
  });

  // ═══════════════════════════════════════════════════════════════════
  //   LIST VIEW
  // ═══════════════════════════════════════════════════════════════════
  function renderList() {
    const host = document.getElementById('rm-list-section');
    if (!host) return;
    host.innerHTML = '';
    if (state.filtered.length === 0) {
      host.innerHTML = '<div class="rm-empty"><div class="rm-empty-title">No items match these filters.</div><div class="rm-empty-dek">Try clearing search or selecting a different lane.</div></div>';
      return;
    }
    // Group by lane. Within each lane, sort by day_start ascending.
    const groups = {};
    state.filtered.forEach(i => {
      (groups[i._lane] = groups[i._lane] || []).push(i);
    });
    LANE_ORDER.forEach(lane => {
      const arr = groups[lane];
      if (!arr || arr.length === 0) return;
      arr.sort((a, b) => a._ds - b._ds);
      const sec = document.createElement('section');
      sec.className = 'rm-list-section';
      sec.innerHTML = `<header class="rm-list-section-h">
        <h2 class="rm-list-section-title">${LANE_LABELS[lane]}</h2>
        <span class="rm-list-section-count">${arr.length}</span>
      </header>`;
      arr.forEach(it => {
        const row = document.createElement('div');
        row.className = 'rm-list-row';
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        const span = it._ds === it._de ? `Day ${it._ds}` : `Day ${it._ds}–${it._de}`;
        const stKey = it._status === 'in_progress' ? 'active' : it._status;
        row.innerHTML = `
          <div class="rm-list-day">${span}</div>
          <div class="rm-list-title">${escapeHtml(it.title || it.id)}</div>
          <div class="rm-list-ws">${LANE_LABELS[lane]}</div>
          <div class="rm-list-st ${cssStatus(it._status)}">${stKey}</div>
        `;
        row.addEventListener('click', () => openDetail(it.id));
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(it.id); }
        });
        sec.appendChild(row);
      });
      host.appendChild(sec);
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  //   DETAIL PANEL
  // ═══════════════════════════════════════════════════════════════════
  function bindDetailPanel() {
    document.getElementById('rm-detail-close').addEventListener('click', closeDetail);
    document.getElementById('rm-detail-backdrop').addEventListener('click', closeDetail);
  }

  function openDetail(id) {
    const item = state.items.find(i => i.id === id);
    if (!item) return;
    state.focusId = id;
    const stKey = item._status === 'in_progress' ? 'active' : item._status;

    document.getElementById('rm-detail-title').textContent = item.title || item.id;
    document.getElementById('rm-detail-ws').textContent = LANE_LABELS[item._lane] || item._lane;
    const stEl = document.getElementById('rm-detail-st');
    stEl.textContent = stKey;
    stEl.className = 'rm-detail-status ' + cssStatus(item._status);
    document.getElementById('rm-detail-desc').textContent = item._desc || 'No description.';

    // Meta
    const meta = document.getElementById('rm-detail-meta');
    meta.innerHTML = '';
    const dayStr = item._ds === item._de ? `Day ${item._ds}` : `Day ${item._ds} – ${item._de}`;
    const dayDate = new Date(DAY_ONE.getTime() + (item._ds - 1) * 86400000);
    const fmt = dayDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
    meta.innerHTML = `
      <dt class="rm-detail-meta-k">Days</dt><dd class="rm-detail-meta-v">${dayStr}<br><span style="color:var(--ink-5)">${fmt}${item._de !== item._ds ? ' · ' + ((item._de - item._ds + 1)) + ' days' : ''}</span></dd>
      <dt class="rm-detail-meta-k">Lane</dt><dd class="rm-detail-meta-v">${LANE_LABELS[item._lane] || item._lane}</dd>
      <dt class="rm-detail-meta-k">ID</dt><dd class="rm-detail-meta-v" style="font-size:.7rem;color:var(--ink-5)">${item.id}</dd>
    `;
    if (item.kill_note) {
      meta.innerHTML += `<dt class="rm-detail-meta-k">Kill note</dt><dd class="rm-detail-meta-v" style="color:var(--red)">${escapeHtml(item.kill_note)}</dd>`;
    }

    // Deps
    const deps = item.deps || item.dependencies || [];
    const depsWrap = document.getElementById('rm-detail-deps-wrap');
    const depsHost = document.getElementById('rm-detail-deps');
    depsHost.innerHTML = '';
    if (deps.length) {
      depsWrap.style.display = '';
      deps.forEach(depId => {
        const dep = state.items.find(i => i.id === depId);
        const row = document.createElement('div');
        row.className = 'rm-detail-dep';
        if (dep) {
          row.textContent = dep.title || depId;
          row.title = depId;
          row.addEventListener('click', () => openDetail(depId));
        } else {
          row.textContent = depId + ' (not found)';
          row.style.color = 'var(--ink-5)';
        }
        depsHost.appendChild(row);
      });
    } else {
      depsWrap.style.display = 'none';
    }

    // Links
    const links = item.links || [];
    const linksWrap = document.getElementById('rm-detail-links-wrap');
    const linksHost = document.getElementById('rm-detail-links');
    linksHost.innerHTML = '';
    if (links.length) {
      linksWrap.style.display = '';
      links.forEach(l => {
        const a = document.createElement('a');
        a.className = 'rm-detail-link';
        a.href = l.href || l.url || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = l.label || l.title || l.href || 'link';
        linksHost.appendChild(a);
      });
    } else {
      linksWrap.style.display = 'none';
    }

    // Open
    const panel = document.getElementById('rm-detail');
    const back = document.getElementById('rm-detail-backdrop');
    panel.classList.add('open');
    back.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.getElementById('rm-detail-close').focus();

    // Re-render to update focused-bar styling + dep arrows
    if (state.view === 'timeline') renderTimeline();
  }

  function closeDetail() {
    const panel = document.getElementById('rm-detail');
    const back = document.getElementById('rm-detail-backdrop');
    panel.classList.remove('open');
    back.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    state.focusId = null;
    if (state.view === 'timeline') renderTimeline();
  }

  // ───────── Keyboard ─────────
  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDetail();
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('rm-search')?.focus();
      }
    });
  }

  // ───────── Resize ─────────
  let resizeTo;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTo);
    resizeTo = setTimeout(() => {
      if (state.view === 'timeline') renderTimeline();
    }, 200);
  });

  // ───────── Helpers ─────────
  function cssStatus(s) {
    if (s === 'in_progress') return 'active';
    return s || 'unspecified';
  }
  function darkLabel(s) {
    return s === 'backlog' || s === 'planned' || s === 'open' || s === 'unspecified' || s === 'killed';
  }
  function truncate(s, n) {
    if (!s) return '';
    if (s.length <= n) return s;
    return s.slice(0, Math.max(1, n - 1)) + '…';
  }
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }
})();
