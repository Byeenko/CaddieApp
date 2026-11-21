---
type: change-request
id: CR-001
status: example
requested: 2026-11-21
requested_by: "EXAMPLE"
priority: P3
---

# CR-001: Left-handed mode

> [!note] Example
> This is a **sample** change request showing the format. Nobody has asked for it yet. Use it as a guide or delete it.

## What's being asked
A setting that flips lessons and diagrams for left-handed golfers ("aim right" becomes "aim left", for example).

## Why
A left-handed friend might start using the app.

## Impact
| Area | Change |
| --- | --- |
| Settings | New left/right switch (`js/config.js` already has `handedness`) |
| Lessons | Directional words need marking so the app can swap them |
| Diagrams | Mirror the SVGs |
| Effort | Medium. Every lesson needs checking |

## Decision
`PLACEHOLDER: approve / defer / reject`. If approved, write a decision note and add it to the [[Roadmap]].
