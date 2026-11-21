import { esc } from '../util.js';
import { icon } from '../icons.js';
import { section, list, lessonRow, lessonMeta, tint } from './components.js';
import { mountWidgets } from '../widgets.js';

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

  // Related: lessons the author linked, then others from the same topic.
  const related = (a.related || []).map((r) => content.articles.get(r)).filter(Boolean);
  const siblings = topic ? content.lessonsUnder(topic.id) : [];
  const more = siblings.filter((s) => s.id !== a.id && !related.includes(s)).slice(0, 4);
  const pos = siblings.findIndex((s) => s.id === a.id);
  const next = pos >= 0 ? siblings[pos + 1] : null;

  const upNext = next
    ? `<a class="next-card" href="#${content.lessonPath(next.id)}">
         <span class="next-label">Up next in ${esc(topic.title)}</span>
         <span class="next-title">${esc(next.title)}</span>
         ${icon('chevronRight', 'row-chevron')}
       </a>`
    : '';

  return {
    title: a.title,
    largeTitle: false,
    body: `
      <article class="lesson" ${tint(category)}>
        <header class="lesson-header" data-large-title>
          <nav class="crumbs">${crumbs.join(`<span class="crumb-sep">›</span>`)}</nav>
          <h1 class="large-title lesson-title">${esc(a.title)}</h1>
          <p class="lead">${esc(a.summary)}</p>
          ${lessonMeta(a)}
        </header>
        <div class="prose">${html}</div>
      </article>
      ${upNext}
      ${related.length ? section('Related lessons', list(related.map((r) => lessonRow(r, content, { showPlace: true })))) : ''}
      ${more.length ? section(`More in ${topic.title}`, list(more.map((r) => lessonRow(r, content)))) : ''}`,
    mount: (page) => mountWidgets(page),
  };
}
