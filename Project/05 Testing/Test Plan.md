---
type: test-plan
updated: 2026-11-21
---

# Test Plan

Two kinds of testing:
1. **Browser tests (Claude):** run automatically at iPhone screen size in light and dark mode, including offline. Run after every change.
2. **On-device tests (you):** things only a real iPhone can show. Log each session with the *Test Run* template in `Test Runs/`.

## Browser checks (automated)

| Area | Check | Last result |
| --- | --- | --- |
| Navigation | Tabs, push/back, back labels, tapping the active tab returns to its first screen, deep links | ✅ 2026-11-21 |
| Library | Categories, topics, subtopic sections, "Coming soon" rows | ✅ 2026-11-21 |
| Lessons | Callouts, tables, diagrams, cross-links, Up next, Related | ✅ 2026-11-21 |
| Search | Ranking, filler words, phrases, highlighting, no-results state | ✅ 2026-11-21 |
| Bookmarks | Save/unsave, toast, Saved list, Recently read | ✅ 2026-11-21 |
| Offline | Service worker installs; lessons open with the network off | ✅ 2026-11-21 |
| Dark mode | All of the above | ✅ 2026-11-21 |
| Console | No errors | ✅ 2026-11-21 |

## On-device checklist (you)

Not done yet. Blocked until the app is hosted. #blocked

**Install**
- [ ] Opens from the link in Safari
- [ ] *Add to Home Screen* shows the green flag icon and the name "Caddie"
- [ ] Opens full-screen with no Safari bars
- [ ] The Home screen footer shows the right version (e.g. `v0.2.0`)

**Look and feel**
- [ ] Status bar at the top is readable in light **and** dark mode
- [ ] Lessons use the New York serif font; text size is comfortable
- [ ] Tab bar clears the home indicator at the bottom
- [ ] Taps feel instant; page transitions are smooth

**Search**
- [ ] Keyboard opens when tapping the search field
- [ ] Pressing *Search* on the keyboard hides it and keeps the results
- [ ] The page doesn't zoom in when the field is tapped

**Offline**
- [ ] Turn on Flight Mode, fully close the app, reopen: Home, Library and lessons all work

**Data**
- [ ] Bookmark a lesson, close the app, reopen: still saved
- [ ] After a week of not opening it, bookmarks are still there

**Updates**
- [ ] After a new version is pushed, reopening the app (twice at most) shows the new version number

**Your mate's phone**
- [ ] Same install and offline checks on his iPhone (`PLACEHOLDER: model / iOS version`)

## Phase 4 field tests (later)
- GPS accuracy against course markers or a rangefinder at 5+ points
- Battery drain over 9 and 18 holes
- Readability in direct sun

## Devices

| Who | Model | iOS | Notes |
| --- | --- | --- | --- |
| You | `PLACEHOLDER` | `PLACEHOLDER` | |
| Mate | `PLACEHOLDER` | `PLACEHOLDER` | |
