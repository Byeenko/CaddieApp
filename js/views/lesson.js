import { esc, toast } from '../util.js';
import { icon } from '../icons.js';
import { section, list, lessonRow, lessonMeta, tint } from './components.js';
import { mountWidgets } from '../widgets.js';
import { enableZoom } from '../lightbox.js';

export default async function lesson({ params: [id], content, store }) {
  const a = content.articles.get(id);
  if (!a) return { title: 'Not found', body: '<div class="empty"><p>That lesson doesn’t exist.</p></div>' };

  const html = await content.articleHtml(id);
  store.addRecent(id);

  const { category, topic, subtopic } = content.placeOf(a);
  const crumbs = [];
  if (category) crumbs.push(`<a href="#/library/${esc(category.id)}">${esc(category.title)}</a>`);
  if (topic) crumbs.push(`<a href="#${content.topicPath(category.id, topic.id)}">${esc(topic.title)}</a>`);
  if (subtopic) crumbs.push(`<span>${esc(subtopic.title)}</span>`);

  const prereqs = (a.prereq || []).map((p) => content.articles.get(p)).filter(Boolean);

  // Related: lessons the author linked, topped up with lessons that share tags.
  const related = (a.related || []).map((r) => content.articles.get(r)).filter((r) => r && r.id !== a.id);
  if (related.length < 3) {
    const tags = new Set(a.tags);
    const extra = [...content.articles.values()]
      .filter((o) => o.id !== a.id && !related.includes(o))
      .map((o) => ({ o, shared: o.tags.filter((t) => tags.has(t)).length }))
      .filter((x) => x.shared > 0)
      .sort((x, y) => y.shared - x.shared)
      .slice(0, 3 - related.length)
      .map((x) => x.o);
    related.push(...extra);
  }
  const siblings = topic ? content.lessonsUnder(topic.id) : [];
  const more = siblings.filter((s) => s.id !== a.id && !related.includes(s)).slice(0, 4);

  // Up next: the following lesson in this category, in library order.
  const sequence = category ? (category.topics || []).flatMap((t) => content.lessonsUnder(t.id)) : [];
  const pos = sequence.findIndex((s) => s.id === a.id);
  const next = pos >= 0 ? sequence[pos + 1] : null;
  if (next) {
    const i = related.indexOf(next);
    if (i !== -1) related.splice(i, 1);
  }

  const saved = store.isSaved(id);
  const saveButton = `
    <button class="nav-action ${saved ? 'is-saved' : ''}" type="button" data-save
      aria-label="${saved ? 'Remove bookmark' : 'Save lesson'}" aria-pressed="${saved}">${icon('bookmark')}</button>`;

  const upNext = next
    ? `<a class="next-card" href="#${content.lessonPath(next.id)}">
         <span class="next-label">Up next in ${esc(category.title)}</span>
         <span class="next-title">${esc(next.title)}</span>
         ${icon('chevronRight', 'row-chevron')}
       </a>`
    : '';

  return {
    title: a.title,
    largeTitle: false,
    actions: saveButton,
    body: `
      <article class="lesson" ${tint(category)}>
        <header class="lesson-header" data-large-title>
          <nav class="crumbs">${crumbs.join(`<span class="crumb-sep">›</span>`)}</nav>
          <h1 class="large-title lesson-title">${esc(a.title)}</h1>
          <p class="lead">${esc(a.summary)}</p>
          ${lessonMeta(a)}
          ${prereqs.length ? `<div class="prereq"><span>Start with</span>${prereqs.map((p) => `<a href="#${content.lessonPath(p.id)}">${esc(p.title)}</a>`).join('')}</div>` : ''}
        </header>
        <div class="prose">${html}</div>
      </article>
      ${upNext}
      ${related.length ? section('Related lessons', list(related.map((r) => lessonRow(r, content, { showPlace: true })))) : ''}
      ${more.length ? section(`More in ${topic.title}`, list(more.map((r) => lessonRow(r, content)))) : ''}`,
    mount(page) {
      mountWidgets(page);
      enableZoom(page);
      const btn = page.querySelector('[data-save]');
      btn.addEventListener('click', () => {
        const now = store.toggleSaved(id);
        btn.classList.toggle('is-saved', now);
        btn.setAttribute('aria-pressed', String(now));
        btn.setAttribute('aria-label', now ? 'Remove bookmark' : 'Save lesson');
        toast(now ? 'Saved' : 'Removed from Saved');
      });
    },
  };
}
