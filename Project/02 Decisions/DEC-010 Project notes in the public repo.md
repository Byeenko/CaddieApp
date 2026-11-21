---
type: decision
id: DEC-010
status: open
date: 2026-11-21
---

# DEC-010: Project notes in the public repo

## The question
Free GitHub Pages needs a **public** repository. Everything in `CaddieApp` gets uploaded, including this `Project` folder. Anyone who finds the repo can read these notes.

## Options
| Option | Pros | Cons |
| --- | --- | --- |
| **A. Leave as is** | Everything backed up and versioned together; simplest | Notes are public (low risk; nothing sensitive so far) |
| **B. Exclude `Project/`** by adding it to `.gitignore` | Notes stay private on your PC | Not backed up by GitHub; use Obsidian Sync or another backup |
| **C. Private repo + paid GitHub** | Everything private | Costs money; not needed for two users |

## Recommendation
**A** for now, as long as nothing private goes into the vault. Switch to **B** the moment it does: no personal details, addresses or passwords.

## Your answer
`PLACEHOLDER: A / B / C` #decision
