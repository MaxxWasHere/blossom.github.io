(function () {
  "use strict";

  const BASE = "/blossom.github.io/";
  const LOGO =
    "https://raw.githubusercontent.com/MaxxWasHere/blossom/main/assets/blossom.png";

  const NAV = [
    {
      label: "Start here",
      items: [
        { id: "home", href: "index.html", label: "Home" },
        { id: "what-is-blossom", href: "what-is-blossom.html", label: "What is Blossom?" },
        { id: "getting-started", href: "getting-started.html", label: "Getting Started" },
      ],
    },
    {
      label: "Guides",
      items: [
        { id: "features", href: "features.html", label: "Features & tabs" },
        { id: "fishing", href: "fishing.html", label: "Fishing mode" },
        { id: "merchant", href: "merchant.html", label: "Auto merchant" },
        { id: "webhooks", href: "webhooks.html", label: "Discord webhooks" },
        { id: "calibrations", href: "calibrations.html", label: "Calibrations" },
        { id: "settings", href: "settings.html", label: "Settings & config" },
      ],
    },
    {
      label: "Customize",
      items: [
        { id: "theming", href: "theming.html", label: "Theming" },
      ],
    },
    {
      label: "Help",
      items: [
        { id: "troubleshooting", href: "troubleshooting.html", label: "Troubleshooting" },
        { id: "credits", href: "credits.html", label: "Credits" },
      ],
    },
    {
      label: "Developers",
      items: [
        { id: "dev", href: "dev.html", label: "Release & build" },
      ],
    },
    {
      label: "Links",
      items: [
        { href: "https://github.com/MaxxWasHere/blossom/releases", label: "Stable releases", external: true },
        { href: "https://github.com/MaxxWasHere/blossombeta/releases", label: "Beta releases", external: true },
        { href: "https://github.com/MaxxWasHere/blossom", label: "Source repo", external: true },
      ],
    },
  ];

  function asset(path) {
    return BASE + path.replace(/^\//, "");
  }

  function linkHref(href) {
    if (href.startsWith("http")) return href;
    return BASE + href.replace(/^\//, "");
  }

  function renderSidebar(activeId) {
    const sections = NAV.map((section) => {
      const items = section.items
        .map((item) => {
          const href = linkHref(item.href);
          const active = item.id === activeId ? " is-active" : "";
          const ext = item.external ? ' target="_blank" rel="noreferrer"' : "";
          return `<li><a href="${href}" class="doc-nav-link${active}"${ext}>${item.label}</a></li>`;
        })
        .join("");
      return `<div class="doc-nav-section">
        <p class="doc-nav-label">${section.label}</p>
        <ul class="doc-nav-list">${items}</ul>
      </div>`;
    }).join("");

    return `<div class="doc-sidebar-inner">
      <a class="doc-brand" href="${linkHref("index.html")}">
        <img src="${LOGO}" alt="Blossom" width="40" height="40" />
        <div class="doc-brand-text">
          <h1>Blossom</h1>
        </div>
      </a>
      ${sections}
      <div class="doc-sidebar-footer">
        <p>Apache 2.0 · <a href="${linkHref("credits.html")}">Credits</a></p>
      </div>
    </div>`;
  }

  function initSidebar() {
    const sidebar = document.getElementById("doc-sidebar");
    if (!sidebar) return;

    const activeId = document.body.dataset.page || "";
    sidebar.innerHTML = renderSidebar(activeId);

    const btn = document.getElementById("doc-menu-btn");
    const overlay = document.getElementById("doc-overlay");
    const close = () => {
      sidebar.classList.remove("is-open");
      overlay?.classList.remove("is-visible");
      document.body.style.overflow = "";
    };
    const open = () => {
      sidebar.classList.add("is-open");
      overlay?.classList.add("is-visible");
      document.body.style.overflow = "hidden";
    };

    btn?.addEventListener("click", () => {
      if (sidebar.classList.contains("is-open")) close();
      else open();
    });
    overlay?.addEventListener("click", close);
    sidebar.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  const HLJS_BASE =
    "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build";
  const HLJS_LANGS = ["css", "javascript", "bash", "json"];

  const HEX_COLOR =
    /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3}|[0-9a-fA-F]{8})\b(?![\w-])/gi;
  const RGBA_COLOR =
    /\brgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*[\d.]+\s*)?\)/gi;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "1") resolve();
        else existing.addEventListener("load", () => resolve(), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = () => {
        script.dataset.loaded = "1";
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function loadHighlightJs() {
    if (window.hljs?.highlightElement) return Promise.resolve();
    return loadScript(`${HLJS_BASE}/highlight.min.js`).then(async () => {
      await Promise.all(
        HLJS_LANGS.map((lang) => loadScript(`${HLJS_BASE}/languages/${lang}.min.js`))
      );
    });
  }

  function detectLanguage(text, wrap) {
    const fromWrap = wrap?.dataset?.lang;
    if (fromWrap) return fromWrap.toLowerCase();

    const sample = String(text || "").trim();
    if (/^(body|html|:root|\.\w|\/\*|@)/m.test(sample) || /--[\w-]+\s*:/.test(sample)) {
      return "css";
    }
    if (/^(import |export |const |let |var |function )/.test(sample)) return "javascript";
    if (/^[\[{]/.test(sample) && /"\w+"\s*:/.test(sample)) return "json";
    if (/^(py |pip |npm |git |cd )/.test(sample) || /\\/.test(sample)) return "bash";
    return "plaintext";
  }

  function langLabel(lang) {
    const labels = {
      css: "CSS",
      javascript: "JavaScript",
      bash: "Shell",
      json: "JSON",
      plaintext: "Code",
    };
    return labels[lang] || lang.toUpperCase();
  }

  function initCodeBlocks() {
    document.querySelectorAll(".doc-code-wrap").forEach((wrap) => {
      const pre = wrap.querySelector("pre");
      const code = wrap.querySelector("code");
      if (!pre || !code) return;

      const lang = detectLanguage(code.textContent, wrap);
      if (!wrap.dataset.lang) wrap.dataset.lang = lang;
      if (!code.className.includes("language-")) {
        code.className = `language-${lang}`;
      }
    });
  }

  function initSyntaxHighlighting() {
    if (!window.hljs) return;
    document.querySelectorAll(".doc-code-wrap pre code").forEach((block) => {
      window.hljs.highlightElement(block);
    });
  }

  function createColorSwatch(color) {
    const swatch = document.createElement("span");
    swatch.className = "doc-color-swatch";
    swatch.style.setProperty("--swatch-color", color);
    swatch.setAttribute("role", "img");
    swatch.setAttribute("aria-label", `Color preview ${color}`);
    swatch.title = color;
    return swatch;
  }

  function shouldSkipColorNode(node) {
    const el = node.parentElement;
    if (!el) return true;
    if (el.closest(".doc-color-swatch, script, style, .doc-lang-badge")) return true;
    if (el.closest(".selector-col")) return true;
    if (el.closest("a[href^='#']")) return true;
    return false;
  }

  function injectSwatchesIntoTextNode(textNode) {
    if (shouldSkipColorNode(textNode)) return;

    const text = textNode.textContent;
    const pattern = new RegExp(
      `${HEX_COLOR.source}|${RGBA_COLOR.source}`,
      "gi"
    );
    if (!pattern.test(text)) return;

    pattern.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const color = match[0];
      frag.appendChild(document.createTextNode(color));
      frag.appendChild(createColorSwatch(color));
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
  }

  function initColorSwatches() {
    const root = document.querySelector(".doc-content");
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(injectSwatchesIntoTextNode);
  }

  function initCopyButtons() {
    document.querySelectorAll(".doc-code-wrap").forEach((wrap) => {
      if (wrap.querySelector(".doc-copy-btn")) return;

      const pre = wrap.querySelector("pre");
      const code = wrap.querySelector("code");
      if (!pre) return;

      const lang = wrap.dataset.lang || "code";
      if (!wrap.querySelector(".doc-lang-badge")) {
        const badge = document.createElement("span");
        badge.className = "doc-lang-badge";
        badge.textContent = langLabel(lang);
        wrap.appendChild(badge);
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "doc-copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        const text = code?.textContent || pre.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Copied";
          btn.classList.add("is-copied");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("is-copied");
          }, 2000);
        } catch {
          btn.textContent = "Failed";
        }
      });
      wrap.appendChild(btn);
    });
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function initHeadingAnchors() {
    const article = document.querySelector(".doc-content");
    if (!article) return;

    article.querySelectorAll("h2, h3").forEach((heading) => {
      const text = heading.textContent?.trim() || "";
      if (!text || heading.querySelector(".doc-anchor")) return;

      let id = heading.id || slugify(text);
      let n = 2;
      while (id && document.getElementById(id) && document.getElementById(id) !== heading) {
        id = `${slugify(text)}-${n++}`;
      }
      heading.id = id;

      const anchor = document.createElement("a");
      anchor.className = "doc-anchor";
      anchor.href = `#${id}`;
      anchor.setAttribute("aria-label", `Link to ${text}`);
      anchor.textContent = "#";
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, "", `#${id}`);
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      heading.appendChild(anchor);
    });
  }

  function initToc() {
    const article = document.querySelector(".doc-content");
    if (!article || !document.body.hasAttribute("data-toc")) return;

    const headings = article.querySelectorAll("h2, h3");
    if (!headings.length) return;

    const toc = document.createElement("nav");
    toc.className = "doc-toc";
    toc.setAttribute("aria-label", "On this page");
    toc.innerHTML = `<p class="doc-toc-title">On this page</p>`;

    const rootList = document.createElement("ul");
    let currentH2List = null;

    headings.forEach((heading) => {
      const id = heading.id;
      if (!id) return;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = heading.childNodes[0]?.textContent?.trim() || heading.textContent?.trim() || "";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        history.pushState(null, "", `#${id}`);
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      li.appendChild(a);

      if (heading.tagName === "H2") {
        rootList.appendChild(li);
        currentH2List = document.createElement("ul");
        li.appendChild(currentH2List);
      } else if (currentH2List) {
        currentH2List.appendChild(li);
      } else {
        rootList.appendChild(li);
      }
    });

    toc.appendChild(rootList);

    const wrapper = document.createElement("div");
    wrapper.className = "doc-article-main";
    while (article.firstChild) {
      wrapper.appendChild(article.firstChild);
    }
    article.appendChild(wrapper);
    article.appendChild(toc);
    article.classList.add("doc-has-toc");

    const links = toc.querySelectorAll("a");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  function initCodeEnhancements() {
    initCodeBlocks();
    loadHighlightJs()
      .then(() => {
        initSyntaxHighlighting();
        initColorSwatches();
        initCopyButtons();
      })
      .catch(() => {
        initColorSwatches();
        initCopyButtons();
      });
  }

  function init() {
    initSidebar();
    initHeadingAnchors();
    initToc();
    initCodeEnhancements();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
