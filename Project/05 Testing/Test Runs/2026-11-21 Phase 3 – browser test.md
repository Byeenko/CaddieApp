---
type: test-run
date: 2026-11-21
version: v0.3.0
tester: Claude
device: "Headless Chrome at iPhone size (393×852, 2× scale)"
result: pass
---

# Phase 3: browser test

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Every lesson renders (83) | ✅ | Opened each lesson by link and checked the title |
| Every `figure` visual mounts | ✅ | 37 of 37 |
| Every diagram inlines | ✅ | All image paths valid (also checked by the build script) |
| No sideways scrolling on any lesson | ✅ | Page width stayed at 393 px |
| Tap to enlarge | ✅ | Opens and closes |
| Navigation, back stacks, deep links | ✅ | Same checks as Phase 2 |
| Search | ✅ | "fried egg" → Plugged Bunker Lie; "stableford" → Scoring & Handicaps |
| Bookmarks | ✅ | |
| Offline | ✅ | Lessons open with the network off |
| Light and dark mode | ✅ | Screenshots reviewed |
| Console errors | ✅ | None |

## Not covered
Animation smoothness and touch feel on a real iPhone (RISK-04). See the on-device checklist in [[Test Plan]].
