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

  // 5. Theme toggle (defaults to dark, persists, swaps the visible icon)
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem('aeoess-theme'); } catch { return null; } })();
  if (saved === 'light') root.dataset.theme = 'light';
  function updateThemeIcons() {
    const isLight = root.dataset.theme === 'light';
    document.querySelectorAll('[data-theme-icon-dark]').forEach((el) => {
      el.style.display = isLight ? 'none' : 'inline';
    });
    document.querySelectorAll('[data-theme-icon-light]').forEach((el) => {
      el.style.display = isLight ? 'inline' : 'none';
    });
  }
  updateThemeIcons();
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('aeoess-theme', next); } catch {}
      updateThemeIcons();
    });
  });

  // 6. Desktop dropdown menus (Solutions, Resources)
  // React stripped at build time; reattach hover + click + outside-close
  // with hover-bridge delay so cursor can cross the 8px gap to the panel.
  document.querySelectorAll('[data-nav-dropdown]').forEach((dropdown) => {
    const button = dropdown.querySelector('button');
    const panel = dropdown.querySelector('[data-nav-dropdown-panel]');
    if (!button || !panel) return;
    let isOpen = false;
    let closeTimer = null;
    const open = () => {
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
      panel.style.pointerEvents = 'auto';
      isOpen = true;
      button.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(-4px)';
      panel.style.pointerEvents = 'none';
      isOpen = false;
      button.setAttribute('aria-expanded', 'false');
    };
    const cancelClose = () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    };
    const scheduleClose = () => {
      cancelClose();
      closeTimer = setTimeout(close, 220);
    };
    button.style.cursor = 'pointer';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    dropdown.addEventListener('mouseenter', () => { cancelClose(); open(); });
    dropdown.addEventListener('mouseleave', scheduleClose);
    panel.addEventListener('mouseenter', cancelClose);
    panel.addEventListener('mouseleave', scheduleClose);
    button.addEventListener('click', (e) => {
      e.preventDefault();
      isOpen ? close() : open();
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) close();
    });
  });
})();
