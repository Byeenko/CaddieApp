---
type: dashboard
project: Caddie
updated: 2026-11-21
version: v0.3.0
phase: "Phase 3 done, Phase 4 next"
---

# Caddie: Project Home

An iPhone golf knowledge library plus an on-course GPS caddie, for you and one mate. Installed from Safari, works offline, no App Store.

> [!info] Keep this note current
> This is the one note to open. At the end of every session:
> 1. Update **Status**, **Working on now** and **Blocked** below.
> 2. Add an entry in `Project/04 Dev Log/` (template: *Dev Log Entry*).
> 3. If anything shipped, update the [[Changelog]].

## Status

| | |
| --- | --- |
| **Version** | v0.3.0 built 21 Nov 2026. **Not pushed yet**: the live site is still the first commit. |
| **Phase** | 3 of 5 done. See [[Roadmap]]. |
| **Live link** | https://byeenko.github.io/CaddieApp/ |
| **Installed on** | Your iPhone: ☑ · Your mate's iPhone: ☐ |
| **Library** | 83 lessons in 16 categories; 58 with visuals. See [[Content Plan]]. |
| **Last session** | [[2026-11-21 Phase 3 – Full library and visuals]] |

## Working on now

- [x] Set up GitHub Pages and install on your iPhone. See [[Setup – Hosting & iPhone Install]].
- [ ] **Push v0.3.0**: GitHub Desktop → Commit to main → Push origin. This also fixes lessons not loading (BUG-012). #now
- [ ] First on-device test with the *Test Run* template. See [[Test Plan]]. #now

## Blocked

- [ ] **GPS caddie (Phase 4).** Blocked by: we need the courses you play. `PLACEHOLDER: course names`. #blocked

## Decisions waiting on you

| Question | Why it matters | Where |
| --- | --- | --- |
| Which courses do you play? | The GPS caddie needs map data for them | [[DEC-008 GPS caddie approach and comp mode]] |
| Keep these project notes in the public GitHub repo? | Free GitHub Pages needs a public repo, so these notes are public | [[DEC-010 Project notes in the public repo]] |

## Next up

- [ ] Send your mate the live link once v0.3.0 is pushed
- [ ] Phase 4: GPS caddie: location permission, live distances, course data
- [ ] Reading refinements: text size, "mark as read" (see [[Feature Backlog]])

## Where to find things

| I need… | Go to |
| --- | --- |
| What we set out to build | [[Original Idea]] · [[Product Requirements v1]] |
| Why something is the way it is | [[Decision Log]] |
| What's planned and in what order | [[Roadmap]] · [[Content Plan]] |
| What happened in each session | `Project/04 Dev Log/` (newest at the bottom) |
| What's tested, and what's broken | [[Test Plan]] · [[Known Issues]] |
| How to put it on the phones | [[Setup – Hosting & iPhone Install]] · [[Release Checklist]] |
| What changed in each version | [[Changelog]] |
| Unfinished lessons and ideas | [[About Drafts]] · [[Lesson Ideas]] |
| Future features | [[Feature Backlog]] |
| How the code, content and visuals work | [[Architecture]] · [[Writing Lessons]] |
| Starting a new session with Claude | [[Working with Claude]] |

## Recent sessions

- [[2026-11-21 Phase 3 – Full library and visuals]]
- [[2026-11-21 Project vault set up]]
- [[2026-11-21 Phase 2 – Search, bookmarks, first lessons]]
- [[2026-11-21 Phase 1 – Core app]]
- [[2026-11-20 Idea and scope]]

## Across the vault

Anything tagged `#blocked` or `#now` in other notes appears here automatically.

```query
tag:#blocked -file:"00 Project Home"
```

```query
tag:#now -file:"00 Project Home"
```
