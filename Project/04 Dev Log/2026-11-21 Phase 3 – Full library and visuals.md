---
type: devlog
date: 2026-11-21
version: 0.3.0
phase: Phase 3
---

# Phase 3: Full library and visuals

*2026-11-21*

## Goal
Phase 3 brief: complete the lesson library across every category, and add visual learning (stick figures, sequences, diagrams, comparisons, animation) that feels part of the app.

## Built
- **Visual engine** (`js/viz/`): pose library; animated `sequence` with weight bars; `compare`; interactive `ball-flight`, `slope`, `chip-ratio`, `clock`, `green-read`, `bunker`. They load only when a lesson uses them, pause off-screen, and respect Reduce Motion.
- **17 SVG diagrams** via `tools/make-diagrams.py`, theme-aware and readable in Obsidian too.
- **Tap-to-enlarge** lightbox for diagrams and comparisons.
- **65 new lessons**, 83 in total. Every topic and subtopic is covered, plus a new **Golf Fitness** category and a **Weight Transfer** lesson.
- **58 lessons have visuals.** The other 25 (rules, mindset, equipment buying and so on) are text-first by design.
- **Prerequisites** ("Start with" links); the build now checks images and visual types.
- Original 18 lessons upgraded with visuals, prerequisites and richer related links.

## Decisions
[[DEC-011 Visuals drawn in code, no video yet]] · [[DEC-012 Library additions and prerequisites]]

## Found and fixed
- Ball-position diagram was mirrored (BUG-011).
- Diagram text overlapped when shown as images (Obsidian); added explicit font sizes.
- Diagrams were double-framed and narrow on the phone; now full width.

## Noticed
- Your GitHub repo has one commit, made before `.nojekyll`, so lessons probably don't load on the live site yet. Pushing v0.3.0 fixes it. #now

## Tested
[[2026-11-21 Phase 3 – browser test]]

## Next
Push v0.3.0 and test on your iPhone, then Phase 4 (GPS caddie), which needs your course names.
