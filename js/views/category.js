import { esc } from '../util.js';
import { section, list, row, categoryIcon, countLabel } from './components.js';

export default async function category({ params: [catId], content }) {
  const cat = content.category(catId);
  if (!cat) return { title: 'Not found', body: '<div class="empty"><p>That category doesn’t exist.</p></div>' };

  const rows = (cat.topics || []).map((t) => {
    const n = content.lessonsUnder(t.id).length;
    return row({
      href: content.topicPath(cat.id, t.id),
      title: t.title,
      subtitle: t.summary || '',
      trailing: countLabel(n),
      dim: n === 0,
    });
  });

  return {
    title: cat.title,
    body: `
      <div class="intro">
        ${categoryIcon(cat, 'large')}
        <p class="lead">${esc(cat.summary)}</p>
      </div>
      ${section('Topics', list(rows))}`,
  };
}
