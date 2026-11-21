---
type: reference
updated: 2026-11-21
---

# Writing Lessons

How to add or edit lessons. Content standards: [[DEC-007 Content writing order]].

## Where lessons live
`content/articles/<category-folder>/<lesson-id>.md`. The file name (without `.md`) is the lesson's ID, used in links. Keep it lowercase with hyphens, e.g. `lag-putting.md`.

## The header

```yaml
---
title: Lag Putting
summary: One or two sentences shown in lists and at the top of the lesson.
topic: speed-control        # a topic or subtopic id from content/library.json
level: beginner             # beginner | intermediate | advanced
order: 1                    # position within its topic (optional)
tags: [putting, speed, distance control]
related: [green-reading]    # other lesson ids, shown at the bottom
prereq: [the-putting-stroke] # optional: "Start with" links at the top
draft: true                 # optional: hide from the app
---
```

To find a topic id, open `content/library.json` and search for the topic's title.

## What you can use in the body

| Write | You get |
| --- | --- |
| `## Heading` | Section heading |
| `[[lesson-id]]` / `[[lesson-id\|label]]` | Link to another lesson (works in Obsidian too) |
| `> [!key] Key points` | Green summary box. Put it at the top |
| `> [!tip]` | Tip |
| `> [!mistake] Title` | Common mistake |
| `> [!drill] Title` | Drill |
| `> [!tour] On tour` | Tour-player example |
| `> [!note]` | Side note |
| Markdown table | Table that scrolls sideways on narrow screens |
| `![Caption](../../diagrams/name.svg)` | Diagram that follows light/dark mode |

## Lesson recipe
Adapt it to the lesson; don't force every part.
1. **Key points** box (3–5 bullets): what it is, in brief
2. **Why it matters**
3. **Clear explanation**
4. **Visual**, where it genuinely helps (see below)
5. **Step-by-step** instructions
6. **Common mistake** callouts
7. **Tips**, and an **On tour** example if there's a good, accurate one
8. **Drill** callout
9. Related lessons (header) plus a link onwards in the text

Australian spelling · yards · right-handed · plain language · check facts before publishing.

## After writing
1. Run `node tools/build-content.mjs` (or ask Claude). Read any warnings: they flag broken links and unknown topics.
2. Tick the lesson in [[Content Plan]].
3. Release it ([[Release Checklist]]) as a PATCH version.

## Adding a category or topic
Edit `content/library.json`. Copy an existing entry and give it a unique `id`. `hue` sets the colour (0–360), and `icon` must be one of the names in `js/icons.js`.

## Visuals

Visuals are drawn in code, so they're tiny, sharp, work offline and follow light/dark mode. There are two kinds.

### 1. Interactive and animated (`figure` blocks)
Write a fenced block with `figure` as the language, then `key: value` lines:

````
```figure
type: sequence
pressure: true
caption: Weight shifts to the trail side, then firmly to the lead side.
```
````

| type | What it shows | Settings |
| --- | --- | --- |
| `sequence` | Animated stick-figure swing, tap a position to pause | `poses` (any of address, takeaway, top, downswing, impact, release, finish), `pressure: true` for weight bars, `focus` (pose shown first), `autoplay: false` |
| `compare` | ✓ / ✕ side by side | `good`, `bad` (pose names, including impact-flip, finish-back, chicken-wing, top-overswing, posture-good, posture-hunched, posture-upright), `good-label`, `bad-label`, `pressure` |
| `ball-flight` | Face and path sliders → shot shape | `preset` (straight, draw, fade, slice, hook, push, pull), `club: driver` |
| `slope` | Uneven lies with setup tips | `lie` (uphill, downhill, above, below) |
| `chip-ratio` | Carry vs roll by club | `club` (sw, pw, 9i, 8i, 7i) |
| `clock` | Wedge clock system | `position` (7:30, 9:00, 10:30) |
| `green-read` | Speed vs break on a sloping putt | — |
| `bunker` | Club entry point in sand, animated | `mode`, `plugged: true` |

Every block can take a `caption`. In Obsidian these show as code blocks; in the app they become the visual. New poses live in `js/viz/core.js`; new visual types are new files in `js/viz/` added to `js/widgets.js`.

### 2. Diagrams (SVG files)
Course layouts, rules diagrams and so on live in `content/diagrams/`. Use them like an image:

```
![Caption shown under the diagram](../../diagrams/where-to-miss.svg)
```

Readers can tap a diagram to enlarge it. The current set is made by `tools/make-diagrams.py` (Python). Edit it and re-run it to change or add diagrams; the build script warns if an image path is wrong.

### Video
There's no video in the app yet: see [[DEC-011 Visuals drawn in code, no video yet]].
