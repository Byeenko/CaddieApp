---
type: decision
id: DEC-001
status: decided
date: 2026-11-21
---

# DEC-001: Installable web app instead of native iOS

## Context
The app has to run on two iPhones, be installed outside the App Store, work offline and use GPS. Development happens on a Windows PC.

## Decision
Build an **installable web app (PWA)**. Open it in Safari, then *Share → Add to Home Screen*. It runs full-screen like a normal app.

## Why
- A native iOS app needs a Mac with Xcode to build. We don't have one.
- Installing a native app outside the App Store means either re-signing it every 7 days (free Apple account) or paying about A$149 a year for a developer account.
- A PWA works on both phones from one link. Updates are just uploading new files.
- It uses the same iPhone location hardware as a native app.

## Trade-offs we accepted
- **GPS only while the app is open on screen.** There's no background tracking, so no automatic shot tracking with the phone in your pocket.
- No Apple Watch app, no widgets, no push notifications (none needed yet).
- iPhone can be stricter with web-app storage than with native apps. Mitigated in [[DEC-005 Offline-first, data on the phone]].

## Revisit if
You get a Mac, want background shot tracking or Apple Watch, or want to sell it on the App Store. The content and logic can be reused; only the "shell" would change.
