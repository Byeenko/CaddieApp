---
type: reference
updated: 2026-11-21
---

# Architecture

How Caddie is put together, in plain terms. The code-level version is in the [[README]] at the vault root.

## The big picture

```
 Obsidian / Claude           Build script              GitHub Pages            iPhone
 ─────────────────           ────────────              ────────────            ──────
 content/articles/*.md  ──►  tools/build-content  ──►  public HTTPS link  ──►  Safari → Home Screen
 content/library.json        • lesson index             (static files,          • service worker saves
 css/ js/ icons/             • link checks               no server)               everything offline
                             • offline file list                                  • bookmarks etc. stored
                             • new version number                                   on the phone
```

## The parts

| Part | Files | What it does |
| --- | --- | --- |
| Shell | `index.html`, `manifest.webmanifest`, `icons/` | Makes it installable with the name "Caddie" and the flag icon |
| Offline | `sw.js`, `precache.json` | Saves every file on first load; switches to new versions automatically |
| Navigation | `js/app.js`, `js/routes.js` | Tabs, per-tab back stacks, screen transitions |
| Screens | `js/views/*.js` | One file per screen: home, library, category, topic, lesson, search, saved, caddie |
| Content | `js/content.js`, `js/render.js` | Loads the library tree and lesson index; turns Markdown into lesson pages |
| Search | `js/search.js` | Ranking and highlighting, all on the phone |
| Phone data | `js/store.js` | Bookmarks, recently read, recent searches, settings |
| Lesson visuals | `js/widgets.js`, `js/viz/*.js`, `js/lightbox.js` | Stick-figure animations, comparisons and interactive demos, loaded only when a lesson uses them; tap-to-enlarge for diagrams |
| Diagrams | `content/diagrams/*.svg`, `tools/make-diagrams.py` | Theme-aware SVG diagrams |
| Design | `css/app.css` | All styling, light and dark |
| Settings | `js/config.js` | App name, version, units, handedness, tabs |

## Design principles
- **Content is data.** Adding knowledge never touches code. See [[DEC-003 Lessons as Markdown in Obsidian]].
- **No server, no accounts.** See [[DEC-005 Offline-first, data on the phone]].
- **One dependency** (*marked*). No frameworks, no build tools beyond plain Node.
- **Modular.** One screen per file, so a new feature means new files rather than rewiring old ones.

## Where Phase 4 will fit
- New `js/gps/` module: location watching, distance maths, course data loading.
- `content/courses/<course>.json`: saved green, bunker and water outlines (from OpenStreetMap).
- The Caddie screen (`js/views/placeholders.js` → `js/views/caddie.js`).
- Shot data goes into IndexedDB behind `js/store.js`.

## Files that aren't part of the app
`Project/`, `templates/`, `README.md`, `DECISIONS.md`, `CADDIE_APP_PLAN.md`, `00 Project Home.md`. These are notes only. The service worker doesn't cache them and the app never loads them, though they're still uploaded to GitHub (see [[DEC-010 Project notes in the public repo]]).
