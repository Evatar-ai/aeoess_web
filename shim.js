// shim.js — vanilla-JS interactivity for the static export.
// Re-binds the few things that need state after React is gone.

(function () {
  // 1. Mobile hamburger
  document.querySelectorAll('.aeoess-hamburger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.closest('header')?.parentElement?.querySelector('.aeoess-mobile-menu')
                || document.querySelector('.aeoess-mobile-menu');
      if (menu) menu.classList.toggle('open');
    });
  });

  // 2. Mobile menu link clicks close the menu
  document.querySelectorAll('.aeoess-mobile-menu a').forEach((a) => {
    a.addEventListener('click', () => {
      a.closest('.aeoess-mobile-menu')?.classList.remove('open');
    });
  });

  // 3. Portal sign-in tabs (anchor-driven)
  document.querySelectorAll('[data-portal-tabs]').forEach((root) => {
    const tabs = root.querySelectorAll('[data-portal-tab]');
    const panes = root.querySelectorAll('[data-portal-pane]');
    function show(name) {
      tabs.forEach((t) => t.classList.toggle('active', t.dataset.portalTab === name));
      panes.forEach((p) => { p.style.display = p.dataset.portalPane === name ? '' : 'none'; });
    }
    tabs.forEach((t) => t.addEventListener('click', (e) => {
      e.preventDefault(); show(t.dataset.portalTab);
      history.replaceState(null, '', '#' + t.dataset.portalTab);
    }));
    const initial = location.hash.slice(1) || (tabs[0] && tabs[0].dataset.portalTab);
    if (initial) show(initial);
  });

  // 4. FAQ accordions — convert any role=button + aria-expanded into a real toggle
  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const head = item.querySelector('[data-faq-head]');
    const body = item.querySelector('[data-faq-body]');
    if (!head || !body) return;
    body.style.display = 'none';
    head.style.cursor = 'pointer';
    head.addEventListener('click', () => {
      const open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      head.setAttribute('aria-expanded', String(!open));
    });
  });

  // 5. Theme toggle (defaults to dark, persists)
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem('aeoess-theme'); } catch { return null; } })();
  if (saved === 'light') root.dataset.theme = 'light';
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('aeoess-theme', next); } catch {}
    });
  });
})();
