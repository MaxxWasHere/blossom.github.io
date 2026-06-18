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
      label: "Macro guides",
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
          <span>Sol's RNG macro — your guide</span>
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

  function init() {
    initSidebar();
    initHeadingAnchors();
    initToc();
    initCopyButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
