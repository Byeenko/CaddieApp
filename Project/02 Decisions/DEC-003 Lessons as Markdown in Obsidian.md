---
type: decision
id: DEC-003
status: decided
date: 2026-11-21
---

# DEC-003: Lessons as Markdown in Obsidian

## Context
The library has to grow indefinitely, and adding knowledge mustn't mean rebuilding the app.

## Decision
- Each lesson is a **Markdown file** in `content/articles/<category>/`, with a small header (title, summary, topic, level, tags, related).
- The category → topic → subtopic tree lives in `content/library.json`.
- The whole folder is an **Obsidian vault**, so lessons can be read and edited in Obsidian.
- `tools/build-content.mjs` turns the lessons into an index and checks for broken links.

## Why
- Content stays completely separate from code.
- Obsidian-friendly features (`[[links]]`, `> [!tip]` callouts) work in both Obsidian and the app.
- Plain text files: easy to back up, diff and move around.

## Trade-offs we accepted
- After adding or editing lessons, run the build script (or ask Claude) so the app's index updates.
- Only one third-party library: *marked*, the Markdown converter (MIT licence).

## Related
[[Writing Lessons]] · [[Architecture]]
