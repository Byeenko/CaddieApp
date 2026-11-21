import { esc } from '../util.js';
import { icon } from '../icons.js';
import { section, list, row, categoryIcon, lessonMeta } from './components.js';
import { searchLessons, searchTopics, highlight, snippet } from '../search.js';

const SUGGESTIONS = ['slice', 'chipping', 'bunker', 'grip', 'tempo', 'uphill', 'pressure', 'pitching'];
let lastQuery = ''; // kept while you switch tabs

function resultRow(r, content) {
  const a = r.article;
  const { category } = content.placeOf(a);
  const excerpt = r.bodyOnly ? snippet(a.text, r.tokens) : a.summary;
  return `
    <a class="row lesson-row" href="#${content.lessonPath(a.id)}" data-result>
      ${category ? categoryIcon(category, 'small') : ''}
      <span class="row-text">
        <span class="row-title">${highlight(a.title, r.tokens)}</span>
        <span class="row-subtitle clamp-2">${highlight(excerpt, r.tokens)}</span>
        ${lessonMeta(a)}
      </span>
      ${icon('chevronRight', 'row-chevron')}
    </a>`;
}

function results(content, store, query) {
  const q = query.trim();
  if (!q) {
    const recent = store.get('searches', []);
    return (
      (recent.length
        ? section('Recent searches', `<div class="chips">${recent.map((s) => `<button class="chip" type="button" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>`)
        : '') +
      section('Try searching for', `<div class="chips">${SUGGESTIONS.map((s) => `<button class="chip" type="button" data-q="${s}">${s}</button>`).join('')}</div>`)
    );
  }
  const lessons = searchLessons(content, q);
  const topics = searchTopics(content, q);
  if (!lessons.length && !topics.length) {
    return `<div class="empty"><span class="empty-icon">${icon('search')}</span>
      <h2>No results for “${esc(q)}”</h2>
      <p>Try a different word, or browse the Library. New lessons are added regularly.</p></div>`;
  }
  return (
    (lessons.length ? section(`${lessons.length} lesson${lessons.length === 1 ? '' : 's'}`, list(lessons.map((r) => resultRow(r, content)))) : '') +
    (topics.length
      ? section('Topics', list(topics.map((t) => row({ href: t.href, leading: categoryIcon(t.category, 'small'), title: t.title, subtitle: t.subtitle }))))
      : '')
  );
}

export default async function searchView({ content, store }) {
  return {
    title: 'Search',
    body: `
      <div class="search-field search-input-wrap">
        ${icon('search')}
        <input id="search-input" type="search" inputmode="search" enterkeyhint="search"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          placeholder="Lessons, topics, keywords" value="${esc(lastQuery)}" aria-label="Search the library">
        <button type="button" class="search-clear" aria-label="Clear" ${lastQuery ? '' : 'hidden'}>×</button>
      </div>
      <div id="search-results">${results(content, store, lastQuery)}</div>`,
    mount(page) {
      const input = page.querySelector('#search-input');
      const out = page.querySelector('#search-results');
      const clear = page.querySelector('.search-clear');
      let timer;

      const update = () => {
        lastQuery = input.value;
        clear.hidden = !input.value;
        out.innerHTML = results(content, store, input.value);
      };
      const remember = () => {
        const q = input.value.trim().toLowerCase();
        if (q.length < 2) return;
        const list = store.get('searches', []).filter((s) => s !== q);
        list.unshift(q);
        store.set('searches', list.slice(0, 8));
      };

      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(update, 120);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          remember();
          input.blur(); // hides the keyboard so you can see the results
        }
      });
      clear.addEventListener('click', () => {
        input.value = '';
        update();
        input.focus();
      });
      out.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-q]');
        if (chip) {
          input.value = chip.dataset.q;
          update();
          remember();
          return;
        }
        if (e.target.closest('a')) remember();
      });
      if (!lastQuery) input.focus();
    },
  };
}
