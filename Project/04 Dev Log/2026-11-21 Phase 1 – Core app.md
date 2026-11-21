---
type: devlog
date: 2026-11-21
version: 0.1.0
phase: Phase 1
---

# Phase 1 – Core app

*2026-11-21*

## Goal
Phase 1 from [[Product Requirements v1]]: architecture, navigation, home screen, content structure, lesson layout.

## Built
- PWA shell, offline service worker, app icon, light and dark design.
- Five tabs with per-tab back stacks, collapsing large titles, page transitions.
- Home: caddie shortcut, continue reading, "Start here" row, category grid.
- Library → Category → Topic → Lesson screens.
- 15 categories and about 75 topics in `content/library.json`.
- Lesson renderer: callouts, tables, theme-aware SVG diagrams, `[[links]]`.
- Build script: lesson index, link checking, offline file list, version bump.
- 4 starter lessons and a ball-position diagram.

## Questions answered
Right-handed · yards · name "Caddie" → [[DEC-004 Users, units and naming]]

## Decisions
[[DEC-001 Installable web app instead of native iOS]] · [[DEC-002 Host on GitHub Pages]] · [[DEC-003 Lessons as Markdown in Obsidian]] · [[DEC-005 Offline-first, data on the phone]] · [[DEC-006 Navigation and screen structure]]

## Tested
Browser at iPhone size, light and dark, offline. See [[2026-11-21 Phase 2 – browser test]] for the combined run. Fixed BUG-001 to BUG-003 (see [[Known Issues]]).

## Next
Phase 2: search, bookmarks, lessons.
