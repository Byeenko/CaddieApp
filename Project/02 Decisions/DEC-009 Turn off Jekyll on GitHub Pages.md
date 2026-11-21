---
type: decision
id: DEC-009
status: decided
date: 2026-11-21
---

# DEC-009: Turn off Jekyll on GitHub Pages

## Context
By default GitHub Pages runs **Jekyll**, which converts any Markdown file with a properties header into an HTML page. Every lesson has that header, so the app would have got "not found" for every lesson once it was live. Spotted on 21 Nov 2026, before the first deployment.

## Decision
Add an empty file called **`.nojekyll`** to the root of the folder. GitHub Pages then serves every file exactly as it is.

## Consequences
- Lessons load correctly once hosted.
- Files and folders starting with `_` are no longer hidden from the website. Keep that in mind for anything private.

## Related
[[Known Issues]] (BUG-008) · [[Setup – Hosting & iPhone Install]]
