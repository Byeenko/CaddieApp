---
type: test-run
date: 2026-11-21
version: v0.2.0
tester: Claude
device: "Headless Chrome at iPhone size (393×852, 2× scale)"
result: pass
---

# Phase 2: browser test

*Automated run on 21 Nov 2026, after the Phase 2 fixes.*

## Scope
Navigation, library, lessons, search, bookmarks, offline, light and dark mode.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Tab switching and back stacks | ✅ | Back label correct; tapping the active tab returns to the Library root |
| Deep link to a topic | ✅ | Back stack rebuilt (back label: "Lies & Condit…") |
| Offline lesson load | ✅ | Service worker in control; *The Uphill Lie* opened with the network off |
| Search: "slice" | ✅ | *Fixing a Slice* ranked first |
| Search: "over the top" | ✅ | *Transition & Downswing*, *Fixing a Slice* at the top (after the fix) |
| Search: "bunker rules" | ✅ | *The Greenside Bunker Shot* only |
| Search: "xyzzy" | ✅ | No-results message |
| Bookmark toggle and Saved list | ✅ | Toast shown; lesson listed in Saved |
| Dark mode visuals | ✅ | Diagram, callouts and tables readable |
| Console errors | ✅ | None |

## Issues found
BUG-004, BUG-005, BUG-006 and BUG-007, all fixed in the same session. See [[Known Issues]].

## Not covered
Anything that needs a real iPhone. See the on-device checklist in [[Test Plan]].
