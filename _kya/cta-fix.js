/* AEOESS CTA + contact-form fix. Additive runtime layer; safe to edit or empty to revert.
   Rewires call-to-action buttons (rendered from page bundles with no link target) to
   natural destinations by matching their visible label. Also wires the contact form to a
   mailto stopgap until a form backend is connected. */
(function () {
  "use strict";

  // label (anchored, lower-cased, trimmed)  ->  destination
  var MAP = [
    [/^(book a walkthrough|book a demo|book a call|book time|get a walkthrough|request a demo|talk to (sales|us|an expert|the team)|contact sales|contact us)\b/, "/contact.html"],
    [/^(see pricing|view pricing|see plans|view plans|compare plans)\b/, "/pricing.html"],
    [/^(get started)\b/, "/pricing.html"],
    [/^(start free|start a free trial|start building|try free|try it free|create (an )?account|sign up|sign in|log in)\b/, "/portal.html"],
    [/^(read the spec|read spec|view the spec|read the protocol|explore the protocol)\b/, "https://agent-passport.org/passport.html"],
    [/^(read the docs|view the docs|view docs|read docs|documentation)\b/, "/docs.html"],
    [/^(view on github|star on github|github)\b/, "https://github.com/aeoess"]
  ];

  function destFor(text) {
    var t = (text || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!t || t.length > 42) return null;
    for (var i = 0; i < MAP.length; i++) if (MAP[i][0].test(t)) return MAP[i][1];
    return null;
  }

  function hrefOk(h) {
    return h && h !== "#" && h !== "" && h.slice(0, 11) !== "javascript:" && h !== "./" && h.indexOf("undefined") === -1;
  }

  function rewireCtas() {
    var els = document.querySelectorAll('a, button, [role="button"]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__ctaFixed) continue;
      var dest = destFor(el.textContent);
      if (!dest) continue;
      var cur = el.tagName === "A" ? el.getAttribute("href") : null;
      if (cur && hrefOk(cur) && cur.indexOf(dest) !== -1) { el.__ctaFixed = true; continue; }
      if (el.tagName === "A" && !hrefOk(cur)) el.setAttribute("href", dest);
      el.style.cursor = "pointer";
      (function (target) {
        el.addEventListener("click", function (e) {
          e.preventDefault(); e.stopPropagation();
          window.location.href = target;
        }, true);
      })(dest);
      el.__ctaFixed = true;
    }
  }

  function wireContactForm() {
    if (!/contact/i.test(location.pathname)) return;
    var form = document.querySelector("form");
    var send = null, btns = document.querySelectorAll('a, button, [role="button"]');
    for (var i = 0; i < btns.length; i++) {
      if (/^\s*send\b/i.test(btns[i].textContent || "")) { send = btns[i]; break; }
    }
    if (!form && !send) return;
    if ((send && send.__cf) || (form && form.__cf)) return;

    function submit(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      function val(sel, idx) {
        var n = document.querySelectorAll(sel);
        var el = n[idx || 0];
        return el ? (el.value || "") : "";
      }
      var name = val('input[type="text"]', 0);
      var email = val('input[type="email"]', 0) || val('input[name*="mail" i]', 0);
      var texts = document.querySelectorAll('input[type="text"]');
      var company = texts.length > 1 ? texts[1].value : "";
      var ta = document.querySelector("textarea");
      var msg = ta ? ta.value : "";
      var subject = "Contact from " + (name || "website") + (company ? " (" + company + ")" : "");
      var body = "Name: " + name + "\nEmail: " + email + "\nCompany: " + company + "\n\n" + msg;
      window.location.href = "mailto:signal@aeoess.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }
    if (send) { send.addEventListener("click", submit, true); send.__cf = 1; }
    if (form) { form.addEventListener("submit", submit, true); form.__cf = 1; }
  }

  function run() { try { rewireCtas(); wireContactForm(); } catch (e) {} }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else { run(); }
  // bundles render via in-browser Babel after load; catch late DOM
  [300, 800, 1600, 3000].forEach(function (t) { setTimeout(run, t); });
  if (window.MutationObserver) {
    var deb, ob = new MutationObserver(function () { clearTimeout(deb); deb = setTimeout(run, 200); });
    document.addEventListener("DOMContentLoaded", function () {
      if (document.body) ob.observe(document.body, { childList: true, subtree: true });
    });
    if (document.body) ob.observe(document.body, { childList: true, subtree: true });
  }
})();
