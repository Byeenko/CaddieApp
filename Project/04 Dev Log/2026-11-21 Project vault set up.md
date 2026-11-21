---
type: devlog
date: 2026-11-21
version: 0.2.0
phase: Phase 2
---

# Project vault set up

*2026-11-21*

## Goal
Turn the vault into a project hub: one note that shows what's in progress, what's blocked, and where everything is.

## Built
- [[00 Project Home]], bookmarked in Obsidian.
- `Project/` folders: brief, decisions, roadmap, dev log, testing, release, drafts, future, reference.
- 10 decision records, roadmap, content plan, test plan, known issues, setup guide, release checklist, changelog.
- Templates: Decision, Dev Log Entry, Test Run, Bug, Change Request, Release.
- Root `DECISIONS.md` now points to the [[Decision Log]].

## Fixed
- **BUG-008**: GitHub Pages' Jekyll would have stopped lessons loading. Added `.nojekyll`. → [[DEC-009 Turn off Jekyll on GitHub Pages]]
- The version number now shows at the bottom of the Home screen, so you can check which version a phone is running.

## Open
- [[DEC-010 Project notes in the public repo]] #decision

## Next
GitHub Pages setup, then the first on-device test. #now
