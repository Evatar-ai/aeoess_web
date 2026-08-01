(function () {
  document.querySelectorAll(".threshold, .ambient-stage").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var b = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - b.left) / b.width - 0.5) * 18 + "px");
      el.style.setProperty("--my", ((e.clientY - b.top) / b.height - 0.5) * 12 + "px");
      el.style.setProperty("--gx", e.clientX + "px");
      el.style.setProperty("--gy", e.clientY + "px");
    });
  });
  var f = document.getElementById("pilot-form");
  if (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var body = [
        "Name: " + (d.get("name") || ""),
        "Organization: " + (d.get("organization") || ""),
        "Email: " + (d.get("email") || ""),
        "",
        "What we would like to pilot:",
        String(d.get("pilot") || ""),
      ].join("\n");
      window.location.assign(
        "mailto:signal@aeoess.com?subject=" +
          encodeURIComponent("Model Citizen pilot") +
          "&body=" +
          encodeURIComponent(body)
      );
    });
  }
})();
