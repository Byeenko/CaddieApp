import { icon } from '../icons.js';
import { esc, greeting, longDate, plural } from '../util.js';
import { section, list, lessonRow, lessonCard, categoryIcon, tint } from './components.js';

export default async function home({ content, store, config }) {
  const recent = store
    .recent()
    .map((id) => content.articles.get(id))
    .filter(Boolean)
    .slice(0, 3);

  const caddieCard = `
    <a class="hero-card" href="#/caddie">
      <span class="hero-icon">${icon('flag')}</span>
      <span class="hero-text">
        <span class="hero-title">On the course?</span>
        <span class="hero-sub">Open the caddie for live distances</span>
      </span>
      ${icon('chevronRight', 'row-chevron')}
    </a>`;

  const continueReading = recent.length
    ? section('Continue reading', list(recent.map((a) => lessonRow(a, content, { showPlace: true }))))
    : '';

  const startHere = content.featured.length
    ? section('Start here', `<div class="carousel">${content.featured.map((a) => lessonCard(a, content)).join('')}</div>`)
    : '';

  const categories = section(
    'Explore the library',
    `<div class="grid">${content.categories
      .map(
        (c) => `
        <a class="tile" href="#/library/${esc(c.id)}" ${tint(c)}>
          ${categoryIcon(c)}
          <span class="tile-title">${esc(c.title)}</span>
        </a>`
      )
      .join('')}</div>`
  );

  const total = content.articles.size;
  const footer = `<p class="footnote">${plural(total, 'lesson')} across ${content.categories.length} categories<br>${esc(config.appName)} v${esc(config.version)}</p>`;

  return {
    title: 'Caddie',
    eyebrow: `${esc(longDate())} · ${greeting()}`,
    body: caddieCard + continueReading + startHere + categories + footer,
  };
}
