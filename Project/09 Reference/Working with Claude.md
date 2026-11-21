---
type: reference
updated: 2026-11-21
---

# Working with Claude

How build sessions run, and how to start a new one without re-explaining everything.

## Starting a new session
Make sure the `CaddieApp` folder is connected in the Claude desktop app, then paste:

> I'm continuing the **Caddie** golf app. The project is in my connected `CaddieApp` folder. Before doing anything, read `00 Project Home.md`, `Project/02 Decisions/Decision Log.md` and the newest note in `Project/04 Dev Log/`. Follow the working rules in `Project/09 Reference/Working with Claude.md`. Today I want to: **`PLACEHOLDER: goal`**.

## Working rules (from the brief)
- Build, don't over-plan. Claude leads technical decisions and explains them simply.
- Ask **one question at a time**, only when it's genuinely needed. Never re-ask anything in the [[Decision Log]].
- Make sensible assumptions and say what they were.
- Build in small steps, test each one, and fix problems before adding more.
- Preserve what works. Inspect the existing files before changing them.
- After each stage, report: **what was built · what works · what needs testing · next step**.

## End-of-session routine (Claude does this, you check it)
- [ ] New dev log entry in `Project/04 Dev Log/` (template: *Dev Log Entry*)
- [ ] [[00 Project Home]] updated: status, working on now, blocked
- [ ] New decisions written and added to the [[Decision Log]]
- [ ] [[Known Issues]] and [[Changelog]] updated
- [ ] [[Content Plan]] regenerated if lessons were added
- [ ] Files saved to the `CaddieApp` folder

## Useful requests
- "Regenerate the Content Plan"
- "Write lessons for *(topic)*, following the lesson recipe in [[Writing Lessons]]"
- "Run the browser tests and log a test run"
- "Prepare release v0.x.y" (runs the [[Release Checklist]])
