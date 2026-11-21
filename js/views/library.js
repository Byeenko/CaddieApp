import { icon } from '../icons.js';
import { section, list, row, categoryIcon, countLabel } from './components.js';

export default async function library({ content }) {
  const searchLink = `
    <a class="search-field" href="#/search">
      ${icon('search')}<span>Search the library</span>
    </a>`;

  const rows = content.categories.map((c) => {
    const n = content.countInCategory(c.id);
    return row({
      href: `/library/${c.id}`,
      leading: categoryIcon(c),
      title: c.title,
      subtitle: c.summary,
      trailing: n ? String(n) : '',
    });
  });

  return {
    title: 'Library',
    body: searchLink + section('', list(rows)),
  };
}
