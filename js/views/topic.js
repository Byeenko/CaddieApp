import { esc } from '../util.js';
import { section, list, row, lessonRow, empty } from './components.js';

export default async function topic({ params: [catId, topicId], content }) {
  const found = content.topic(topicId);
  if (!found || found.category.id !== catId) {
    return { title: 'Not found', body: '<div class="empty"><p>That topic doesn’t exist.</p></div>' };
  }
  const t = found.node;
  const own = content.lessonsIn(t.id);
  const subs = t.subtopics || [];

  let body = t.summary ? `<p class="lead intro-text">${esc(t.summary)}</p>` : '';

  if (own.length) body += section(subs.length ? 'Overview' : 'Lessons', list(own.map((a) => lessonRow(a, content))));

  for (const s of subs) {
    const lessons = content.lessonsIn(s.id);
    body += section(
      s.title,
      lessons.length
        ? list(lessons.map((a) => lessonRow(a, content)))
        : list([row({ title: s.summary || s.title, trailing: 'Coming soon', dim: true })])
    );
  }

  if (!own.length && !subs.length) {
    body += empty({
      iconName: 'library',
      title: 'No lessons yet',
      text: `Lessons on ${esc(t.title.toLowerCase())} are on the way.`,
    });
  }

  return { title: t.title, body };
}
