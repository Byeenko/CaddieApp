---
type: index
updated: 2026-11-21
---

# About Drafts

Somewhere to work on lessons and ideas **before** they go into the app.

## How drafts work
- Anything in `Project/07 Drafts/` is **never** shown in the app. Write freely.
- When a lesson is ready, move it into `content/articles/<category>/` and make sure its header has a real `topic` from `content/library.json`. Then run the build (or ask Claude).
- If you'd rather keep a lesson in `content/articles/` but hidden, add `draft: true` to its header and the build will skip it.

## What's here
- [[Lesson Ideas]]: quick notes on lessons to write, tips heard from mates, things that worked on the course
- [[EXAMPLE – Putting Setup draft]]: an **example** half-finished lesson, showing the format

## Turning an idea into a lesson
1. Jot it in [[Lesson Ideas]].
2. When ready, create a note here from the *lesson* template.
3. Rough it out, or ask Claude to write it up from your notes.
4. Move it into `content/articles/` and run the build.
5. Tick it off in [[Content Plan]].
