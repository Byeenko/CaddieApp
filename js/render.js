// Turns a lesson's Markdown into HTML for the reader.
//
// Supported on top of normal Markdown (all of these also work in Obsidian):
//   [[lesson-id]] or [[lesson-id|label]]   cross-reference to another lesson
//   > [!tip] Title                         callout box (tip, key, mistake, drill, note, tour)
//   ![Caption](../../diagrams/x.svg)       diagram — SVGs are inlined so they follow light/dark mode
//   ```widget name```                      interactive demo (Phase 3) — see js/widgets.js

import { Marked } from './vendor/marked.esm.js';
import { esc } from './util.js';
import { icon } from './icons.js';

const FRONT_MATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

const CALLOUTS = {
  key: { label: 'Key points', icon: 'info' },
  tip: { label: 'Tip', icon: 'info' },
  mistake: { label: 'Common mistake', icon: 'info' },
  drill: { label: 'Drill', icon: 'practice' },
  tour: { label: 'On tour', icon: 'fundamentals' },
  note: { label: 'Note', icon: 'info' },
  warning: { label: 'Warning', icon: 'info' },
};

let content = null; // set per render so wiki-links can look up titles

const marked = new Marked({ gfm: true });
marked.use({
  extensions: [
    {
      name: 'wikilink',
      level: 'inline',
      start: (src) => src.indexOf('[['),
      tokenizer(src) {
        const m = /^\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/.exec(src);
        if (m) return { type: 'wikilink', raw: m[0], target: m[1].trim(), label: m[2]?.trim() };
      },
      renderer(t) {
        const id = t.target.split('/').pop().replace(/\.md$/, '');
        const a = content?.articles.get(id);
        const label = esc(t.label || a?.title || t.target);
        return a
          ? `<a class="xref" href="#/lesson/${esc(id)}">${label}</a>`
          : `<span class="xref xref-missing" title="Lesson not written yet">${label}</span>`;
      },
    },
  ],
});

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function inlineSvg(img, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const svg = new DOMParser().parseFromString(await res.text(), 'image/svg+xml').documentElement;
    if (svg.nodeName !== 'svg') return;
    svg.querySelectorAll('script').forEach((s) => s.remove());
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', img.alt || 'Diagram');
    svg.classList.add('diagram-svg');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    img.replaceWith(document.importNode(svg, true));
  } catch {
    /* leave the <img> in place */
  }
}

export async function renderArticle(markdown, articlePath, contentApi) {
  content = contentApi;
  let body = markdown.replace(FRONT_MATTER, '');
  body = body.replace(/^\s*# .*\n/, ''); // the title comes from front matter

  const tpl = document.createElement('template');
  tpl.innerHTML = marked.parse(body);
  const root = tpl.content;
  const base = new URL(articlePath, document.baseURI);

  // Headings get ids so they can be linked to later.
  root.querySelectorAll('h2, h3').forEach((h) => (h.id = slug(h.textContent)));

  // Callouts:  > [!type] Optional title
  root.querySelectorAll('blockquote').forEach((bq) => {
    const first = bq.firstElementChild;
    if (!first || first.tagName !== 'P') return;
    const m = /^\[!(\w+)\][+-]?[ \t]*([^\n]*)\n?/.exec(first.innerHTML);
    if (!m) return;
    const type = m[1].toLowerCase();
    const def = CALLOUTS[type] || CALLOUTS.note;
    first.innerHTML = first.innerHTML.slice(m[0].length);
    if (!first.innerHTML.trim()) first.remove();
    const aside = document.createElement('aside');
    aside.className = `callout callout-${CALLOUTS[type] ? type : 'note'}`;
    aside.innerHTML = `<div class="callout-title">${icon(def.icon)}<span>${m[2].trim() || def.label}</span></div><div class="callout-body"></div>`;
    aside.lastElementChild.append(...bq.childNodes);
    bq.replaceWith(aside);
  });

  // Tables scroll sideways on narrow screens.
  root.querySelectorAll('table').forEach((t) => {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    t.replaceWith(wrap);
    wrap.append(t);
  });

  // Links: other lessons by filename, outside sites in a new window.
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (/^https?:/i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    } else if (/\.md(#.*)?$/.test(href)) {
      const id = href.replace(/#.*$/, '').split('/').pop().replace(/\.md$/, '');
      a.setAttribute('href', `#/lesson/${id}`);
      a.classList.add('xref');
    }
  });

  // Images and diagrams.
  const jobs = [];
  root.querySelectorAll('img').forEach((img) => {
    const url = new URL(img.getAttribute('src'), base).href;
    img.src = url;
    img.loading = 'lazy';
    const fig = document.createElement('figure');
    fig.className = 'figure';
    img.replaceWith(fig);
    fig.append(img);
    if (img.alt) fig.insertAdjacentHTML('beforeend', `<figcaption>${esc(img.alt)}</figcaption>`);
    if (/\.svg$/i.test(url)) jobs.push(inlineSvg(img, url));
  });
  await Promise.all(jobs);

  // Visuals: ```figure``` blocks (key: value lines) become mount points for js/widgets.js.
  root.querySelectorAll('pre > code.language-figure, pre > code.language-widget').forEach((code) => {
    const el = document.createElement('div');
    el.className = 'widget';
    const params = {};
    if (code.classList.contains('language-widget')) {
      params.type = code.textContent.trim();
    } else {
      for (const line of code.textContent.split('\n')) {
        const m = /^\s*([\w-]+)\s*:\s*(.*?)\s*$/.exec(line);
        if (m) params[m[1]] = m[2];
      }
    }
    el.dataset.widget = params.type || '';
    el.dataset.params = JSON.stringify(params);
    code.parentElement.replaceWith(el);
  });

  const out = document.createElement('div');
  out.append(root);
  return out.innerHTML;
}
