---
type: decision
id: DEC-011
status: decided
date: 2026-11-21
---

# DEC-011: Visuals drawn in code, no video yet

## Context
Phase 3 asked for stick-figure illustrations, swing sequences, ball-flight and course diagrams, correct-vs-incorrect comparisons, and video or animation where it helps. It must stay fast, work offline, look native, and only use material we're legally allowed to use.

## Decision
- All visuals are **drawn in code** (SVG + small JavaScript modules in `js/viz/`), not images or video files.
- **Animated stick figures** replace video: one pose library drives swing animations (with weight-shift bars), comparisons and interactive demos.
- **Diagrams** (course layouts, rules relief, wind, etc.) are SVG files made by `tools/make-diagrams.py`.
- Lessons add visuals with a simple `figure` block or a normal image link (see [[Writing Lessons]]).
- **No video for now.**

## Why
- **Legal:** everything is original, so there's no copyrighted instructional footage or images.
- **Offline and fast:** the whole visual system is a few dozen KB, versus megabytes per video clip.
- **Consistent design:** visuals use the app's own colours and switch with light/dark mode automatically.
- **Editable:** changing a pose or a diagram is a code change, not a re-shoot.

## Trade-offs we accepted
- Stick figures are simpler than real video of a real swing.
- No 3D, and no down-the-line animation yet (face-on only for animations).

## Revisit if
We want real swing footage. Options would be filming your own swings (you own them), or licensed clips. Either needs a decision about storage size, since video makes the offline cache much bigger.
