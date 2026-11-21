---
type: checklist
updated: 2026-11-21
---

# Release Checklist

Use this every time a new version goes out to the phones. Copy it into a new note with the *Release* template if you want a record of each release.

## Version numbers
`MAJOR.MINOR.PATCH`
- **MINOR** goes up when a phase or a noticeable feature ships (v0.2.0 → v0.3.0)
- **PATCH** goes up for fixes and new lessons only (v0.2.0 → v0.2.1)
- **MAJOR** goes to 1 when both phones are using it on the course (end of Phase 5)

The version lives in `js/config.js` and shows at the bottom of the Home screen.

## Before
- [ ] Update `version` in `js/config.js`
- [ ] Run `node tools/build-content.mjs` (or ask Claude) and read any warnings
- [ ] Browser test passes (Claude runs it)
- [ ] Update [[Changelog]]
- [ ] Update [[Known Issues]] (move fixed items down)

## Ship
- [ ] GitHub Desktop: write a short summary (e.g. `v0.2.1: putting lessons`) → **Commit to main** → **Push origin**
- [ ] Wait about a minute for GitHub Pages

## After
- [ ] Open Caddie on your phone, close it fully, open it again
- [ ] The Home footer shows the new version
- [ ] Spot-check what changed
- [ ] Let your mate know there's an update
- [ ] Update **Status** on [[00 Project Home]]

## Rolling back
In GitHub Desktop: **History** → right-click the bad commit → **Revert changes in commit** → **Push**. Phones pick up the reverted version the next time they open the app.
