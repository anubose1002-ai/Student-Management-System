# Student Management System — 3D Website

A responsive GitHub Pages project showcase with a Three.js 3D hero scene and an interactive browser-only student directory demo.

## Website features

- Responsive dark visual design with restrained teal accents
- Interactive Three.js 3D scene, particles, lighting, and pointer response
- Scroll-driven storytelling section where a 3D student-record card transforms as the visitor scrolls
- Dashboard summary metrics
- Add, search, edit, and delete demo student records
- Browser local storage for demo records
- Links to project documentation

## Important architecture note

This website is a static frontend. The browser demo stores its sample records in the current browser's `localStorage`; it is not connected to a server and records do not sync between visitors. Do not enter real student personal information.

The separate `main.py` file is a Python/Tkinter desktop application. GitHub Pages cannot execute Python or Tkinter.

## Deploy to GitHub Pages

1. Upload the repository files to the root of the `main` branch.
2. In repository **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Wait for the Pages deployment workflow to succeed.
4. Open the published Pages URL.

## Files

- `index.html` — custom homepage and browser demo
- `assets/styles.css` — layout, theme, and responsive styling
- `assets/app.js` — student demo interactions and browser storage
- `assets/scene.js` — Three.js scene
- `index.md`, `setup.md`, `features.md`, `screenshots.md`, `documentation.md` — project documentation
- `main.py` — Python desktop application source

## External assets

The 3D module loads Three.js from jsDelivr, and the font stylesheet loads Google Fonts. Those visual enhancements require an internet connection. If the CDN is unavailable, the page content and student demo should remain usable, but the 3D scene may not render.
