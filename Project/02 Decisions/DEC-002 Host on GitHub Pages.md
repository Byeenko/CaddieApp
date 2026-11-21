---
type: decision
id: DEC-002
status: decided
date: 2026-11-21
---

# DEC-002: Host on GitHub Pages

## Context
iPhones only allow installing a web app, and only allow it to use GPS, when it's served over **HTTPS** from a real web address.

## Decision
Host the app free on **GitHub Pages**, managed with **GitHub Desktop**. The `CaddieApp` folder *is* the repository.

## Why
- Free, reliable HTTPS. No server to run.
- Publishing an update is *Commit → Push* in GitHub Desktop.
- Every version is kept in history, so you can roll back.

## Trade-offs we accepted
- Free GitHub Pages needs a **public** repository, which means the code and these notes are publicly visible (though hard to find). See [[DEC-010 Project notes in the public repo]].

## Related
[[Setup – Hosting & iPhone Install]] · [[DEC-009 Turn off Jekyll on GitHub Pages]]
