// Searching the library. Runs entirely on the phone, so it works offline.
//
// Every word you type has to appear somewhere in a lesson for it to match.
// Matches in the title count most, then tags, the topic it sits under, the
// summary, and finally the body text.

import { esc } from './util.js';

export const normalize = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const STOP = new Set(['the', 'a', 'an', 'to', 'of', 'and', 'in', 'on', 'my', 'i', 'how', 'do', 'is', 'for', 'with', 'what', 'why']);

/** Splits a search into words, dropping filler words unless that's all there is. */
export const tokenize = (q) => {
  const all = normalize(q).split(/[^a-z0-9]+/).filter(Boolean);
  const kept = all.filter((t) => !STOP.has(t));
  return kept.length ? kept : all;
};

function count(haystack, needle) {
  let n = 0;
  for (let i = haystack.indexOf(needle); i !== -1 && n < 10; i = haystack.indexOf(needle, i + needle.length)) n++;
  return n;
}

// Pre-normalised fields, built once per session.
let index = null;
function buildIndex(content) {
  index = [...content.articles.values()].map((a) => {
    const p = content.placeOf(a);
    return {
      a,
      title: normalize(a.title),
      tags: normalize(a.tags.join(' ')),
      place: normalize([p.category?.title, p.topic?.title, p.subtopic?.title].filter(Boolean).join(' ')),
      summary: normalize(a.summary),
      text: normalize(a.text),
    };
  });
}

export function searchLessons(content, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  if (!index) buildIndex(content);
  const phrase = normalize(query).replace(/[^a-z0-9]+/g, ' ').trim();
  const multiWord = phrase.includes(' ');
  const results = [];

  for (const f of index) {
    let score = 0;
    let bodyOnly = true;
    let matchedAll = true;
    for (const t of tokens) {
      let s = 0;
      if (new RegExp(`\\b${t}`).test(f.title)) s += 30;
      else if (f.title.includes(t)) s += 12;
      if (f.tags.includes(t)) s += 15;
      if (f.place.includes(t)) s += 10;
      if (f.summary.includes(t)) s += 8;
      if (s) bodyOnly = false;
      s += count(f.text, t);
      if (!s) {
        matchedAll = false;
        break;
      }
      score += s;
    }
    if (!matchedAll) continue;
    if (f.title.includes(phrase)) score += 40;
    if (multiWord && f.tags.includes(phrase)) score += 40;
    if (multiWord && f.text.includes(phrase)) score += 20;
    results.push({ article: f.a, score, bodyOnly, tokens });
  }
  return results.sort((x, y) => y.score - x.score || x.article.title.localeCompare(y.article.title));
}

/** Categories, topics and subtopics whose name matches the search. */
export function searchTopics(content, query) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const out = [];
  const hit = (title) => tokens.every((t) => normalize(title).includes(t));
  for (const c of content.categories) {
    if (hit(c.title)) out.push({ title: c.title, subtitle: 'Category', href: `/library/${c.id}`, category: c });
    for (const t of c.topics || []) {
      if (hit(t.title)) out.push({ title: t.title, subtitle: c.title, href: `/library/${c.id}/${t.id}`, category: c });
      for (const s of t.subtopics || []) {
        if (hit(s.title)) out.push({ title: `${t.title}: ${s.title}`, subtitle: c.title, href: `/library/${c.id}/${t.id}`, category: c });
      }
    }
  }
  return out.slice(0, 6);
}

/** Escapes text and wraps the searched words in <mark>. */
export function highlight(text, tokens) {
  if (!tokens?.length) return esc(text);
  const re = new RegExp(`\\b(${tokens.join('|')})`, 'gi'); // highlight at word starts only
  let out = '';
  let last = 0;
  for (const m of String(text).matchAll(re)) {
    out += esc(text.slice(last, m.index)) + `<mark>${esc(m[0])}</mark>`;
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

/** A short excerpt of the lesson around the first match. */
export function snippet(text, tokens, radius = 70) {
  const lower = text.toLowerCase();
  let pos = -1;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i !== -1 && (pos === -1 || i < pos)) pos = i;
  }
  if (pos === -1) return '';
  const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, pos - radius)) + 1);
  const endSpace = text.indexOf(' ', pos + radius);
  const end = endSpace === -1 ? text.length : endSpace;
  return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
}
