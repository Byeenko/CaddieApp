---
type: decision
id: DEC-005
status: decided
date: 2026-11-21
---

# DEC-005: Offline-first, data on the phone

## Decision
- A **service worker** (`sw.js`) saves every app file and every lesson to the phone on first load. After that, everything works with no signal.
- Each build gives the app a new version number, so phones fetch updates the next time the app opens.
- Personal data (bookmarks, recently read, recent searches, settings) stays **on the phone** in local storage, all through `js/store.js`.
- The app asks iOS to keep this data permanently ("persistent storage").

## Why
Courses often have poor reception, and the brief asks for local-first.

## Trade-offs we accepted
- Bookmarks don't sync between your phone and your mate's. Each phone has its own.
- If the app is deleted from the home screen, its saved data goes with it. A backup/export option is in the [[Feature Backlog]].
- Shot history (later) will need IndexedDB. `store.js` is built so that change stays in one place.
