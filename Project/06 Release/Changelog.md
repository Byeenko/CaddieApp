---
type: changelog
updated: 2026-11-21
---

# Changelog

What changed in each version, newest first. "Released" means pushed to GitHub Pages.

## v0.3.0: Complete library & visual learning
*Built 21 Nov 2026 · Released: `PLACEHOLDER: date pushed`*

**New**
- **83 lessons** (up from 18) covering every topic and subtopic, including the new Golf Fitness category and a Weight Transfer lesson
- **Visual engine:** animated stick-figure swings with weight-shift bars, correct-vs-incorrect comparisons, and interactive demos for ball flight, uneven lies, chipping carry/roll, the wedge clock, green reading and bunker entry
- **17 diagrams:** hole layout, penalty-area relief, risk/reward, where to miss, dispersion, wind, low point, trajectory, wedge bounce, kinematic sequence and more
- **Tap to enlarge** diagrams and comparisons; pinch to zoom
- **"Start with"** prerequisite links on lessons
- Build script now checks images and visual types

**Fixed**
- Ball-position diagram was mirrored: the target is now on the right for the face-on view (BUG-011)
- Driver lesson and *Bouncing Back* written (BUG-009, BUG-010)

## v0.2.0: Library, search & bookmarks
*Built 21 Nov 2026 · Released: 21 Nov 2026 (first push, before `.nojekyll`; lessons may not have loaded until v0.3.0 is pushed)*

**New**
- Search: offline, ranked, highlighted, with suggestions and recent searches
- Bookmarks, plus a Saved tab with "Recently read"
- Related lessons, "More in this topic", "Up next" across each category
- 14 lessons: the full swing sequence, Fixing a Slice, Ball-Flight Laws, chipping, pitching, bunkers, choosing the short-game shot
- Version number shown on the Home screen

**Fixed**
- Lessons would not have loaded on GitHub Pages; added `.nojekyll` (BUG-008)
- Search ranking for multi-word phrases; highlight inside words; back-button overlap; duplicate "Up next" (BUG-004 to BUG-007)

## v0.1.0: Core app
*Built 21 Nov 2026 · Not released separately*

**New**
- Installable iPhone web app, offline support, light and dark design
- Five tabs: Home, Library, Search, Saved, Caddie (the last three were placeholders)
- 15 categories and about 75 topics; lesson layout with callouts, tables, diagrams and cross-links
- 4 lessons: The Grip, Ball Position, The Uphill Lie, The Pre-Shot Routine

**Fixed**
- Deep links, cramped tables, empty subtopic rows (BUG-001 to BUG-003)
