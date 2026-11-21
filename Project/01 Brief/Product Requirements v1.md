---
type: brief
date: 2026-11-21
status: current
---

# Product Requirements v1

*Your requirements document, handed to Claude on 21 Nov 2026 to start the build. Condensed here; the meaning is unchanged. Decisions made in response are linked.*

## 1. Audience
- Just you and one mate for now. Build around your needs.
- Structure content so it can grow from complete beginner to experienced golfer.
- Goal: a comprehensive golf knowledge resource you can keep expanding.

## 2. Platform and installation
- **iPhone only**, installed directly on your phones, **not** through the App Store.
- **Local-first:** knowledge, bookmarks, settings and user data stored on the phone.
- **Core library works offline.**
- Compare native iOS against an installable web app, considering: install outside the App Store, offline, GPS, local storage, performance, ease of development and room to expand.
- → [[DEC-001 Installable web app instead of native iOS]] · [[DEC-002 Host on GitHub Pages]]

## 3. Core concept: a golf knowledge library
- A carefully organised reference library, **not** a gamified learning app.
- Hierarchy: categories → topics → subtopics → lessons and articles, with cross-references.
- Starting areas: fundamentals and rules, swing, driving, irons and approach, short game, putting, course management, club selection, shot shaping, equipment, practice and drills, mental game, lies and conditions, on-course decisions, advanced concepts. **More can be added indefinitely.**
- Learning experience: comprehensive explanations, clear structure, practical examples, diagrams, *mild* interactivity (sliders) only where it helps, search, bookmarks, related topics.
- Should feel like a premium golf reference.
- → [[DEC-003 Lessons as Markdown in Obsidian]] · [[Content Plan]]

## 4. Live caddie
- Tap-based. GPS distances to relevant points. Simple and readable mid-round.
- Investigate GPS accuracy, permissions, battery, offline use, distances to greens and hazards.
- **Key distinction:** GPS works offline, but distances to greens and hazards need **course mapping data**.
- Expand later to club recommendations, shot tracking, stats, course intelligence and history.
- Get reliable basic GPS working first.
- → [[DEC-008 GPS caddie approach and comp mode]]

## 5. Business model
- None: no subscriptions, payments or ads. Don't block future commercialisation.

## 6. Technical architecture
- Local-first, offline-first, modular, maintainable content, fast, reliable GPS, expandable, simple install.
- **Content separate from the interface**: add, edit and reorganise knowledge without rebuilding the app.
- Avoid unnecessary dependencies and infrastructure.
- → [[Architecture]] · [[DEC-005 Offline-first, data on the phone]]

## 7. Design direction
- Clean, modern, premium, native-feeling iPhone app. Excellent readability, logical hierarchy, minimal clutter, consistent typography, thoughtful colour, quality diagrams, fast access to frequent info.
- → [[DEC-006 Navigation and screen structure]]

## 8. Roadmap
Phase 1 core app → Phase 2 knowledge library → Phase 3 learning experience → Phase 4 GPS caddie → Phase 5 refinement. → [[Roadmap]]

## 9. How to work
- Vibe-coding: build, don't over-plan. Claude leads technical decisions and explains them simply.
- Ask one question at a time, only when needed. Don't re-ask settled things. Make sensible assumptions.
- Track decisions, build incrementally, test as you go, fix before layering.
- After each stage: what was built, what works, what needs testing, next step.
- → [[Working with Claude]]

## Answers given after the brief (21 Nov)
- Both golfers are **right-handed** · distances in **yards** · app name **Caddie**. → [[DEC-004 Users, units and naming]]
- No preference on writing order. → [[DEC-007 Content writing order]]
