# Confirmed Decisions

A running log of what's been decided, so nothing gets asked twice.

## Product
- **Users:** two right-handed golfers (you and a mate). Content is written for right-handers but structured to grow from beginner to advanced.
- **Units:** yards.
- **App name:** Caddie.
- **No business model:** no payments, ads or subscriptions. Keep the architecture open to it later.
- **Two halves:** Off the Course (knowledge library) and On the Course (GPS caddie).
- **Library feel:** a premium reference library, not a gamified app. Use interactivity only where it genuinely helps.

## Technical (21 Nov 2026)
- **Platform:** installable web app (PWA), added to the iPhone home screen from Safari. Chosen over native iOS because development happens on Windows (no Mac/Xcode), there's no Apple developer fee or 7-day re-signing, and installing and updating is simple.
- **Hosting:** GitHub Pages (free HTTPS, needed for install and GPS).
- **Offline-first:** a service worker caches the whole app and library on the phone.
- **Local-first:** settings, reading history and bookmarks live on the phone (`js/store.js`). Larger data such as shot history will move to IndexedDB behind the same module.
- **Content separate from code:** lessons are Markdown files in an Obsidian vault, and the category tree is `content/library.json`. Adding content never means changing app code.
- **Dependencies:** one bundled library (marked, the Markdown parser). No frameworks, no build tools, no server.
- **Navigation:** five tabs (Home, Library, Search, Saved, Caddie), each with its own back stack, like a native app.

## Known limitations (accepted)
- GPS only runs while the app is open on screen. No background tracking, so automatic shot tracking from the pocket isn't possible.
- Distances to greens and hazards need course map data. Plan: download from OpenStreetMap for your courses, store it on the phone, and fill gaps by marking points ourselves.
- Club recommendations count as "advice" under the Rules of Golf in competitions, so they'll go behind a comp-mode switch. Distance-only is fine in most comps.

## Phase status
- [x] Phase 1: core app, navigation, home, content structure, lesson layout
- [ ] Phase 2: populate library, search, bookmarks, cross-references
- [ ] Phase 3: diagrams, interactive demos
- [ ] Phase 4: GPS caddie
- [ ] Phase 5: refinement and testing on both phones
