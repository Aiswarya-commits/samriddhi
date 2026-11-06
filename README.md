# Alethia Earth — Fully Restored Standalone Website

This directory contains a complete, self-contained replica of [https://www.alethia.earth/](https://www.alethia.earth/).

All assets, lazy-loaded Framer component modules, 3D scroll-driven canvas image sequences, videos, and fonts have been downloaded, restructured, and rewritten to run 100% locally and offline without external dependencies.

---

## Quick Start (How to Run)

### Option 1: Double-Click (Easiest on Windows)
Simply double-click **`start.bat`**.
It will start the local server and automatically open the website in your default browser at `http://localhost:3000`.

### Option 2: Using Node.js / NPM
```bash
npm start
```
or
```bash
node server.js
```
Then visit **`http://localhost:3000`** in your browser.

### Option 3: Using Python
```bash
python serve.py
```
Then visit **`http://localhost:3000`** in your browser.

---

## What Was Fixed & Restored

1. **Repaired Failed Downloads ("No Content" files)**:
   - The original "Save All Resources" dump contained 185 dummy files with `No Content: <url>` stubs (including web fonts, WOFF2 files, and scroll animation frames).
   - All 185 missing files were identified, re-requested directly from the source CDN with appropriate headers, and saved.

2. **Recursively Crawled Lazy-Loaded Framer Modules**:
   - Modern Framer websites split routes and components into dynamic code chunks (`import('./chunk.mjs')`).
   - Recursively crawled the entire module dependency graph and downloaded all 53 sub-page and component modules that were not triggered during initial page capture.

3. **Restored 3D Floating Island Scroll Animation**:
   - Downloaded all **211 desktop frames** (`floating-island_00000.webp` through `floating-island_00210.webp`).
   - Downloaded all **210 mobile frames** (`floating-island-mob_00000.webp` through `floating-island-mob_00209.webp`).

4. **Restored All Media & Assets**:
   - Downloaded 58 missing high-res images and WebP visuals.
   - Downloaded 46 Lottie animation JSON files, MP4 and WebM videos, and typography font sets.
   - Downloaded all Google Fonts from `fonts.gstatic.com`.

5. **Restructured & Localized Paths**:
   - Consolidated the disparate domain folders (`framerusercontent.com`, `r2-assets.alethia.earth`, `fonts.gstatic.com`) into clean web directories:
     - `/sites/6AN2yDPkGAirmFqcg2kbn3/` (all ES modules)
     - `/images/` (all image assets)
     - `/assets/` (Lottie JSONs, video clips, Framer fonts)
     - `/fonts/` (Google web fonts)
     - `/r2-assets/` (floating island image sequences and loop videos)
     - `/videos/` (hero cloud animation video)
   - Rewrote all hardcoded remote URLs across `index.html` and 47 `.mjs` code bundles to local paths.

6. **Custom Built-In Local Web Server**:
   - Built `server.js` (Node) and `serve.py` (Python) with:
     - Proper MIME types for ES modules (`.mjs` -> `application/javascript`) so browsers will not block execution.
     - HTTP 206 Range Request support for smooth video streaming and timeline scrubbing.
     - Permissive CORS headers (`*`) to ensure canvas scrubbing and WebGL textures load without browser security restrictions.
     - Single Page Application (SPA) routing fallback so sub-routes like `/our-tech/amrv` and `/solutions/supply-chain` load properly.

---

## Directory Structure

```
www.alethia.earth/
├── index.html          # Main site entry point (rewritten for local assets)
├── start.bat           # 1-click Windows launcher
├── server.js           # Lightweight Node.js server (zero dependencies)
├── serve.py            # Standalone Python HTTP server
├── package.json        # NPM scripts configuration
├── sites/              # Framer JavaScript ES modules and chunks
├── images/             # Photographic assets and diagrams
├── assets/             # Lottie animations, videos, and fonts
├── fonts/              # Google web fonts
├── r2-assets/          # 3D floating island webp frames & video loops
└── videos/             # Hero cloud animation video
```
