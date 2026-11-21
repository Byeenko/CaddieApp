---
type: setup
updated: 2026-11-21
status: done (your phone)
---

# Setup: Hosting & iPhone Install

One-time setup, about 10 minutes. Tick each step as you go. Why it's done this way: [[DEC-001 Installable web app instead of native iOS]] · [[DEC-002 Host on GitHub Pages]].

## Details to fill in as you go

| | |
| --- | --- |
| GitHub username | Byeenko |
| Repository name | `CaddieApp` *(suggested)* |
| Live link | https://byeenko.github.io/CaddieApp/ |
| Set up on | `PLACEHOLDER: date` |

> [!warning] Before you publish
> The repository will be **public**, and that includes this `Project` folder. Decide [[DEC-010 Project notes in the public repo]] first. If you choose option B, add a line `Project/` to the `.gitignore` file **before** step 3.

## 1. GitHub account
- [ ] Create a free account at github.com and verify your email

## 2. GitHub Desktop
- [ ] Download and install GitHub Desktop from desktop.github.com
- [ ] Sign in with your GitHub account

## 3. Publish the folder
- [ ] In GitHub Desktop: **File → Add local repository** → choose `Desktop\Claudes Brain\CaddieApp`
- [ ] When it says it isn't a repository yet, click **create a repository** → **Create repository**
- [ ] Click **Publish repository**, **untick** *Keep this code private*, then **Publish**

## 4. Turn on GitHub Pages
- [ ] On github.com, open the repo → **Settings** → **Pages**
- [ ] Under *Build and deployment*, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then **Save**
- [ ] Wait 1–2 minutes and refresh. Copy the link shown at the top into the table above.
- [ ] Check `.nojekyll` is in the repo's file list. Without it, lessons won't load. See [[DEC-009 Turn off Jekyll on GitHub Pages]]

## 5. Install on your iPhone
- [ ] Open the link in **Safari** (not Chrome)
- [ ] Tap **Share** → **Add to Home Screen** → **Add**
- [ ] Open Caddie from the home screen and check the version at the bottom of Home
- [ ] Run the on-device checklist in [[Test Plan]] and log it with the *Test Run* template

## 6. Your mate's iPhone
- [ ] Send him the link
- [ ] He follows step 5

## Updating later
Every release: follow the [[Release Checklist]]. The short version is **Commit → Push** in GitHub Desktop, wait a minute, and reopen the app on the phone.

## If something goes wrong

| Problem | Fix |
| --- | --- |
| Link shows 404 | Pages takes a few minutes the first time. Check Settings → Pages shows a green "Your site is live" |
| App opens but lessons say "Could not load lesson" | `.nojekyll` missing. Add it, commit, push |
| Old version still showing | Fully close the app (swipe it away) and reopen; it can take two opens |
| No "Add to Home Screen" option | You're not in Safari, or you're in a private tab |
