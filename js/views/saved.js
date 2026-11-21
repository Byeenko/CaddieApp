import { section, list, lessonRow, empty } from './components.js';

export default async function savedView({ content, store }) {
  const saved = store
    .bookmarks()
    .map((b) => content.articles.get(b.id))
    .filter(Boolean);
  const savedIds = new Set(saved.map((a) => a.id));
  const recent = store
    .recent()
    .map((id) => content.articles.get(id))
    .filter((a) => a && !savedIds.has(a.id))
    .slice(0, 5);

  const body = saved.length
    ? section('', list(saved.map((a) => lessonRow(a, content, { showPlace: true }))), {
        note: 'To remove a lesson, open it and tap the bookmark again.',
      })
    : empty({
        iconName: 'bookmark',
        title: 'Nothing saved yet',
        text: 'Tap the bookmark at the top of any lesson to keep it here, one tap away.',
      });

  return {
    title: 'Saved',
    body: body + (recent.length ? section('Recently read', list(recent.map((a) => lessonRow(a, content, { showPlace: true })))) : ''),
  };
}
