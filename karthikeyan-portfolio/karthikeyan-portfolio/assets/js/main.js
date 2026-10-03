/* Karthikeyan Kumaravel — Portfolio behaviour. No dependencies. */
(function () {
  "use strict";

  var cfg = window.PORTFOLIO || {};
  var links = cfg.links || {};
  var PLACEHOLDER = /example\.com|your-profile|your-username/i;
  var showPh = cfg.showPlaceholders !== false;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function isSet(v) { return typeof v === "string" && v.trim() !== "" && !PLACEHOLDER.test(v); }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "className") n.className = attrs[k]; else n.setAttribute(k, attrs[k]);
    });
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- 1. Bind configurable links ---------- */
  function bindLinks() {
    var map = {
      linkedin: links.linkedin,
      github: links.github,
      email: links.email ? "mailto:" + links.email : "",
      resume: cfg.resume && cfg.resume.path,
      "resume-download": cfg.resume && cfg.resume.path
    };
    $all("[data-link]").forEach(function (a) {
      var key = a.getAttribute("data-link");
      var raw = key === "email" ? links.email : map[key];
      if (!map[key]) return;
      a.setAttribute("href", map[key]);
      if (key === "resume-download" && cfg.resume.downloadName) a.setAttribute("download", cfg.resume.downloadName);
      if ((key === "linkedin" || key === "github" || key === "email") && !isSet(raw) && showPh) {
        a.classList.add("is-placeholder");
        a.setAttribute("title", "Placeholder — set links." + key + " in assets/js/config.js");
      }
    });
  }

  /* ---------- 2. Structured data from config ---------- */
  function updateSchema() {
    var s = $("#person-schema");
    if (!s) return;
    try {
      var data = JSON.parse(s.textContent);
      if (cfg.name) data.name = cfg.name;
      if (cfg.role) data.jobTitle = cfg.role;
      if (isSet(cfg.siteUrl)) data.url = cfg.siteUrl;
      var same = [links.linkedin, links.github].filter(isSet);
      if (same.length) data.sameAs = same;
      s.textContent = JSON.stringify(data);
    } catch (e) { /* leave static schema untouched */ }
  }

  /* ---------- 3. Header, mobile nav, active section ---------- */
  function initNav() {
    var header = $(".site-header");
    var toggle = $(".menu-toggle");
    var nav = $("#site-nav");
    var navLinks = $all("#site-nav a");

    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      toggle.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
    }
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    navLinks.forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !header.contains(e.target)) setOpen(false);
    });

    // Map every section to the nav item it belongs to.
    var owner = { home: "home", about: "about", work: "work", ai: "ai", leadership: "leadership", principles: "leadership", stack: "stack", github: "stack", journey: "contact", resume: "contact", contact: "contact" };
    if (typeof window.IntersectionObserver !== "function") return;
    var current = "";
    function activate(id) {
      var target = owner[id] || id;
      if (target === current) return;
      current = target;
      navLinks.forEach(function (a) {
        if (a.getAttribute("href") === "#" + target) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) activate(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $all("main > section[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------- 4. Reveal on scroll (section content only) ---------- */
  function initReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof window.IntersectionObserver !== "function") return;
    var targets = $all(".section .section-head, .lifecycle, .capabilities, .feature, .agent-flow, .duties, .principles, .constellation, .timeline, .resume-cta");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    targets.forEach(function (t) {
      // Don't hide anything already on screen at load.
      if (t.getBoundingClientRect().top < window.innerHeight) return;
      t.classList.add("reveal");
      io.observe(t);
    });
  }

  /* ---------- 5. AI workflow tabs (WAI-ARIA tabs pattern) ---------- */
  function initTabs() {
    var list = $(".agent-stages");
    if (!list) return;
    var tabs = $all("[role=tab]", list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  /* ---------- 6. Stack filter ---------- */
  function initStack() {
    var buttons = $all(".stack-filters button");
    var wrap = $(".constellation");
    if (!wrap) return;
    var clusters = $all(".cluster", wrap);
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter");
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        wrap.classList.toggle("is-filtered", f !== "all");
        clusters.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-group") === f); });
      });
    });
  }

  /* ---------- 7. Career timeline ---------- */
  function renderCareer() {
    var list = $("#timeline");
    var items = cfg.career;
    if (!list || !Array.isArray(items) || !items.length) return;
    list.textContent = "";
    items.forEach(function (c) {
      var li = el("li");
      li.appendChild(el("h3", null, c.phase || "Untitled phase"));
      var meta = el("p", { className: "tl-meta" });
      [["title", "Role"], ["company", "Company"], ["period", "Dates"]].forEach(function (f) {
        if (c[f[0]]) meta.appendChild(el("span", null, c[f[0]]));
        else if (showPh) meta.appendChild(el("span", { className: "ph" }, "[" + f[1] + "]"));
      });
      if (meta.childNodes.length) li.appendChild(meta);
      if (c.summary) li.appendChild(el("p", { className: "tl-summary" }, c.summary));
      list.appendChild(li);
    });
  }

  /* ---------- 8. Additional projects ---------- */
  function renderProjects() {
    var grid = $("#project-grid");
    if (!grid || !Array.isArray(cfg.projects)) return;
    cfg.projects.forEach(function (p) {
      if (!p || !p.name) return;
      var art = el("article", { className: "project" });
      art.appendChild(el("h4", { className: "project-name" }, p.name));
      var dl = el("dl", { className: "project-facts" });
      function fact(label, value) {
        if (!value) return;
        var d = el("div");
        d.appendChild(el("dt", null, label));
        var dd = el("dd");
        if (Array.isArray(value)) {
          var ul = el("ul", { className: "tags" });
          value.forEach(function (t) { ul.appendChild(el("li", null, t)); });
          dd.appendChild(ul);
        } else dd.textContent = value;
        d.appendChild(dd);
        dl.appendChild(d);
      }
      fact("Problem", p.problem);
      fact("Solution", p.solution);
      fact("Technology", p.tech);
      fact("Engineering challenge", p.challenge);
      art.appendChild(dl);
      var lk = el("p", { className: "project-links" });
      if (isSet(p.repo)) lk.appendChild(el("a", { href: p.repo, target: "_blank", rel: "noopener" }, "Source on GitHub"));
      if (isSet(p.demo)) lk.appendChild(el("a", { href: p.demo, target: "_blank", rel: "noopener" }, "Live demo"));
      if (lk.childNodes.length) art.appendChild(lk);
      grid.appendChild(art);
    });
  }

  /* ---------- 9. GitHub public repositories (lazy, single request) ---------- */
  function initGitHub() {
    var area = $("#repo-area");
    if (!area) return;
    var gh = cfg.github || {};
    var url = links.github || "";
    var m = isSet(url) ? url.match(/github\.com\/([A-Za-z0-9-]+)\/?$/) : null;
    if (!m) {
      if (showPh) area.appendChild(el("p", { className: "repo-state" }, "Set links.github in assets/js/config.js to list public repositories here."));
      return;
    }
    if (gh.showRepos === false) return;
    var user = m[1];

    function state(msg, withLink) {
      area.textContent = "";
      var p = el("p", { className: "repo-state" }, msg + " ");
      if (withLink) p.appendChild(el("a", { href: url, target: "_blank", rel: "noopener" }, "View repositories on GitHub"));
      area.appendChild(p);
    }

    function load() {
      state("Loading public repositories…");
      var key = "gh-repos:" + user;
      try {
        var cached = JSON.parse(sessionStorage.getItem(key) || "null");
        if (cached && Date.now() - cached.t < 3600000) return render(cached.d);
      } catch (e) { /* storage unavailable */ }

      fetch("https://api.github.com/users/" + encodeURIComponent(user) + "/repos?sort=updated&per_page=30&type=owner", {
        headers: { Accept: "application/vnd.github+json" }
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) {
          try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) { /* ignore */ }
          render(d);
        })
        .catch(function () { state("GitHub didn't respond, so repositories can't be listed right now.", true); });
    }

    function render(repos) {
      var list = (repos || []).filter(function (r) {
        return !r.private && !r.archived && (gh.includeForks || !r.fork);
      }).slice(0, gh.maxRepos || 6);
      if (!list.length) return state("No public repositories yet.", true);
      area.textContent = "";
      var grid = el("div", { className: "repo-grid" });
      list.forEach(function (r) {
        var a = el("a", { className: "repo", href: r.html_url, target: "_blank", rel: "noopener" });
        a.appendChild(el("span", { className: "repo-name" }, r.name));
        if (r.description) a.appendChild(el("span", { className: "repo-desc" }, r.description));
        var meta = el("span", { className: "repo-meta" });
        if (r.language) meta.appendChild(el("span", null, r.language));
        if (r.updated_at) meta.appendChild(el("span", null, "Updated " + new Date(r.updated_at).toLocaleDateString(undefined, { year: "numeric", month: "short" })));
        a.appendChild(meta);
        grid.appendChild(a);
      });
      area.appendChild(grid);
    }

    if (typeof window.IntersectionObserver === "function") {
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { io.disconnect(); load(); }
      }, { rootMargin: "400px 0px" });
      io.observe(area);
    } else load();
  }

  /* ---------- Boot ---------- */
  function boot() {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
    bindLinks();
    updateSchema();
    initNav();
    initTabs();
    initStack();
    renderCareer();
    renderProjects();
    initGitHub();
    initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
