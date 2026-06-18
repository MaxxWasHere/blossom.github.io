# Blossom documentation (GitHub Pages)

Static HTML documentation site for the [Blossom](https://github.com/MaxxWasHere/blossom) macro.

## Live site (use this URL)

**https://maxxwashere.github.io/blossom.github.io/**

This repo is a **project** site (`MaxxWasHere/blossom.github.io`), not a user site. The root URL **https://maxxwashere.github.io/** will 404 unless you also maintain a separate repo named **`MaxxWasHere.github.io`**. For a shorter URL, rename this repo to `MaxxWasHere.github.io` (user/org Pages) and update asset paths from `/blossom.github.io/` to `/`.

Plain HTML, CSS, and JavaScript — no build step required.

## GitHub Pages setup

1. Push this repository to GitHub (`MaxxWasHere/blossom.github.io`).
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/ (root)`**.
5. Save. The site publishes at the URL above within a minute or two.

Each push to `main` updates the live site automatically.

## Local preview

From this folder:

```powershell
python -m http.server 8080
```

Open http://localhost:8080/blossom.github.io/ in your browser (asset paths match project Pages).

Or open `index.html` directly (some features work best over HTTP).

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `what-is-blossom.html` | Overview & FAQ |
| `getting-started.html` | Install & first run |
| `calibrations.html` | Calibration guide |
| `theming.html` | Themes & Custom UI |
| `troubleshooting.html` | Common fixes |
| `credits.html` | Authors & licenses |
| `dev.html` | Release & build notes (maintainers) |
| `assets/css/site.css` | Blossom sakura dark theme |
| `assets/js/site.js` | Sidebar, mobile menu, copy buttons |

User-facing docs live here. The main [blossom](https://github.com/MaxxWasHere/blossom) repo links to this site instead of shipping a `docs/` folder.
