---
type: issues
updated: 2026-11-21
---

# Known Issues

Bugs and gaps, newest at the top of each list. Larger bugs can get their own note (template: *Bug*); small ones just live in this table.

**Severity:** 🔴 breaks something important · 🟠 annoying · 🟢 cosmetic or content gap

## Open

| ID | Issue | Sev. | Found | Notes |
| --- | --- | --- | --- | --- |
| RISK-04 | Animations not yet checked for smoothness on an older iPhone | 🟢 | 2026-11-21 | They pause off-screen and respect Reduce Motion |
| BUG-012 | If lessons show "Could not load lesson" on the phone, the live site predates `.nojekyll`. Push the latest version | 🔴 | 2026-11-21 | Fixed in the files; needs a push #now |
| RISK-01 | Status bar colour in standalone mode not yet checked on a real iPhone | 🟠 | 2026-11-21 | [[Test Plan]] #blocked |
| RISK-02 | Search keyboard behaviour not yet checked on a real iPhone | 🟠 | 2026-11-21 | [[Test Plan]] #blocked |
| RISK-03 | iOS may ask for location permission more often than a native app would | 🟠 | 2026-11-21 | Phase 4 |

## Fixed

| ID | Issue | Sev. | Fixed in | How |
| --- | --- | --- | --- | --- |
| BUG-011 | Ball-position diagram was mirrored (target shown on the left in a face-on view) | 🟠 | v0.3.0 | Redrawn with target on the right |
| BUG-010 | *Bouncing Back* lesson linked but not written | 🟢 | v0.3.0 | Written |
| BUG-009 | Driving › *Slices, Hooks & Pop-Ups* empty | 🟢 | v0.3.0 | Written and cross-linked |
| BUG-008 | GitHub Pages' Jekyll would convert lessons to HTML, so every lesson would fail to load once live | 🔴 | v0.2.0 | Added `.nojekyll`. See [[DEC-009 Turn off Jekyll on GitHub Pages]] |
| BUG-007 | "Up next" lesson also appeared under Related | 🟢 | v0.2.0 | Removed from Related |
| BUG-006 | Long lesson titles overlapped the back button | 🟠 | v0.2.0 | Back label now truncates |
| BUG-005 | Search highlighted "top" inside "stop" | 🟢 | v0.2.0 | Highlight only at word starts |
| BUG-004 | Multi-word searches ("over the top") ranked badly | 🟠 | v0.2.0 | Filler words ignored, exact phrase boosted |
| BUG-003 | Empty subtopics looked like broken rows | 🟢 | v0.1.0 | "Coming soon" label |
| BUG-002 | Tables cramped on phone (first column wouldn't wrap) | 🟠 | v0.1.0 | Wrapping plus a fixed first-column width |
| BUG-001 | Changing the address or following an outside link didn't open the new screen | 🟠 | v0.1.0 | The app now listens for address changes |
