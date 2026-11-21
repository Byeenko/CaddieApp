# Caddie

A golf knowledge library and on-course GPS caddie for iPhone. It's an installable web app (PWA): no App Store, works offline, and all data is stored on the phone.

## Putting it on your iPhones (one-time setup)

The app needs a free HTTPS web address so iPhones can install it and use GPS. GitHub Pages gives you that for free.

1. Make a free account at **github.com**.
2. Install **GitHub Desktop** (desktop.github.com) and sign in.
3. In GitHub Desktop: **File → Add local repository**, choose this `CaddieApp` folder, and click **create a repository** when it offers. Then click **Publish repository**. Untick *Keep this code private*, because free GitHub Pages needs a public repo.
4. On github.com, open the repo → **Settings → Pages** → under *Branch* choose `main` and `/ (root)` → **Save**. After a minute you'll get a link like `https://yourname.github.io/CaddieApp/`.
5. On each iPhone: open that link in **Safari** → tap **Share** → **Add to Home Screen**.

Send your mate the same link and he does step 5.

## Updating the app

When files in this folder change, open GitHub Desktop → **Commit to main** → **Push origin**. The phones pick up the new version the next time the app is opened. If you don't see the change, fully close the app and open it again.

## Adding and editing lessons

Lessons are Markdown files in `content/articles/`. You can open the whole folder as an Obsidian vault and edit them there.

**Quickest way to start a new lesson:** copy `templates/lesson.md`. In Obsidian you can switch on *Settings → Core plugins → Templates*, set the template folder to `templates`, and insert it with one click.

Every lesson starts with a small header:

```yaml
---
title: The Grip
summary: One or two sentences shown in lists and at the top of the lesson.
topic: grip            # a topic or subtopic id from content/library.json
level: beginner        # beginner | intermediate | advanced
order: 1               # position within its topic (optional)
tags: [grip, clubface]
related: [ball-position, pre-shot-routine]   # other lesson file names
---
```

Inside a lesson you can use:

| Write this | You get |
| --- | --- |
| `[[ball-position]]` or `[[ball-position\|custom text]]` | A link to another lesson |
| `> [!key] Key points` | Green summary box |
| `> [!tip]` · `> [!mistake]` · `> [!drill]` · `> [!tour]` · `> [!note]` | Tip, common mistake, drill, tour example, note |
| `![Caption](../../diagrams/name.svg)` | A diagram that adapts to light/dark mode (tap to enlarge) |
| ` ```figure ` block with `type: …` | An animated or interactive visual. See `Project/09 Reference/Writing Lessons.md` |
| Normal Markdown tables, lists, headings | As expected |

Categories and topics live in `content/library.json`. Add a new category or topic there and it appears in the app straight away.

**After adding or editing lessons**, run `node tools/build-content.mjs` (needs Node.js from nodejs.org), or just ask Claude. It refreshes the lesson list, checks for broken links, and tells the phones there's an update.

## How the code is organised

```
index.html              App shell
manifest.webmanifest    Home-screen name and icon
sw.js / precache.json   Offline support (generated version number)
css/app.css             All visual design, light and dark mode
js/
  app.js                Start-up and navigation (tabs, back stacks)
  routes.js             Every screen and its address
  config.js             App name, units (yards), tabs
  content.js            Loads and indexes the library
  render.js             Markdown → lesson HTML (links, callouts, diagrams)
  store.js              Data saved on the phone
  search.js             Offline search and ranking
  widgets.js            Loads lesson visuals on demand
  viz/                  Stick figures, animations and interactive demos
  lightbox.js           Tap-to-enlarge for diagrams
  views/                One file per screen
  vendor/marked.esm.js  Markdown parser (MIT licence), the only third-party code
content/
  library.json          Category → topic → subtopic tree
  manifest.json         Generated lesson index
  articles/             Lessons (Markdown)
  diagrams/             SVG diagrams
templates/lesson.md     Starting point for new lessons
tools/build-content.mjs Content builder; plain Node, no installs
tools/make-diagrams.py  Draws the SVG diagrams (Python, no packages)
```

## Previewing on a computer

From this folder run `python -m http.server 8000` and open `http://localhost:8000`. In Chrome DevTools, switch on device mode and pick an iPhone.
