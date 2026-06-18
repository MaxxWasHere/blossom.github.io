(function () {
  "use strict";

  const BASE = "/blossom.github.io/";
  const LOGO =
    "https://raw.githubusercontent.com/MaxxWasHere/blossom/main/assets/blossom.png";

  const NAV = [
    {
      label: "Guides",
      items: [
        { id: "home", href: "index.html", label: "Home" },
        { id: "what-is-blossom", href: "what-is-blossom.html", label: "What is Blossom?" },
        { id: "getting-started", href: "getting-started.html", label: "Getting Started" },
        { id: "calibrations", href: "calibrations.html", label: "Calibrations" },
        { id: "theming", href: "theming.html", label: "Theming" },
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
          <span>Sol's RNG macro docs</span>
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

  function initCopyButtons() {
    document.querySelectorAll(".doc-code-wrap").forEach((wrap) => {
      const pre = wrap.querySelector("pre");
      if (!pre) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "doc-copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        const text = pre.textContent || "";
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

  function init() {
    initSidebar();
    initCopyButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
