---
type: devlog
date: 2026-11-21
version: 0.2.0
phase: Phase 2
---

# Phase 2 – Search, bookmarks, first lessons

*2026-11-21*

## Goal
Phase 2: search, bookmarks, cross-references, and filling the library.

## Built
- **Search**: on the phone, ranked (title > tags > topic > summary > body), ignores filler words, boosts exact phrases, highlights matches, shows snippets, suggests searches and remembers recent ones.
- **Bookmarks**: button on every lesson, Saved tab, "Recently read".
- **Suggested reading**: Related (your links plus shared tags), "More in topic", "Up next" across the category.
- **Lesson template** in `templates/lesson.md`.
- **14 new lessons**: setup, alignment, takeaway, backswing, downswing, impact, finish, tempo, fixing a slice, ball-flight laws, chipping, pitching, greenside bunkers, choosing the shot.

## Decisions
[[DEC-007 Content writing order]]

## Tested
[[2026-11-21 Phase 2 – browser test]]. Fixed BUG-004 to BUG-007.

## Next
You choose: Phase 3 (interactive demos) or more lessons first. #decision
