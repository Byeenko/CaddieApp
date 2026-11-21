---
type: roadmap
updated: 2026-11-21
---

# Roadmap

Build order from [[Product Requirements v1]]. Tick items as they're done, and add the date.

## Phase 1: Core app ✅ (21 Nov 2026, v0.1.0)
- [x] Project set up and architecture chosen → [[DEC-001 Installable web app instead of native iOS]]
- [x] Main navigation (5 tabs, back stacks) → [[DEC-006 Navigation and screen structure]]
- [x] Home screen
- [x] Content structure: 15 categories, ~75 topics → `content/library.json`
- [x] Lesson layout: callouts, tables, diagrams, cross-links
- [x] Offline support

## Phase 2: Knowledge library ✅ (21 Nov 2026, v0.2.0)
- [x] Search (offline, ranked, highlighted)
- [x] Bookmarks and Saved tab
- [x] Related topics, suggested reading, "Up next"
- [x] Easy-to-expand content (template, build script with link checking)
- [x] First content batch: swing fundamentals, short game, ball flight (18 lessons)
- [x] Remaining lessons: done in Phase 3. The library keeps growing; see [[Content Plan]]

## Phase 3: Learning experience ✅ (21 Nov 2026, v0.3.0)
- [x] Complete library: 83 lessons, every topic covered, new Golf Fitness category
- [x] Animated stick-figure swing sequences with weight-shift bars
- [x] Correct-vs-incorrect comparisons
- [x] Ball-flight slider: face angle and path → curve
- [x] Slope demo: uphill, downhill and sidehill effects
- [x] Chipping carry/roll, wedge clock, green-reading speed, bunker entry demos
- [x] 17 diagrams (course layouts, rules, wind, low point and more), tap to enlarge
- [ ] Reading refinements: text size setting, "mark as read" (moved to the backlog)

## Phase 4: GPS caddie ⏳ next
- [ ] Location permission flow
- [ ] Live GPS distance to a point (prove accuracy first)
- [ ] Course data import for your course(s) → [[DEC-008 GPS caddie approach and comp mode]] #blocked
- [ ] Front, centre and back of green, plus hazard carries
- [ ] Hole-by-hole screen, readable in sunlight, big tap targets
- [ ] On-course accuracy test (use the *Test Run* template)

## Phase 5: Refinement
- [ ] Performance pass
- [ ] Full offline test on the course
- [ ] Interface polish (swipe-back gesture, update banner)
- [ ] Bug fixes from [[Known Issues]]
- [ ] Installed and tested on **both** iPhones
- [ ] Architecture ready for the [[Feature Backlog]]

## Parking lot
Ideas that came up mid-build and aren't in a phase yet go in the [[Feature Backlog]], not here.
