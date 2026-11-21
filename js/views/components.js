// Building blocks shared by several screens.

import { icon } from '../icons.js';
import { esc, plural, LEVELS } from '../util.js';

export const tint = (cat) => `style="--hue:${cat?.hue ?? 150}"`;

export function categoryIcon(cat, size = '') {
  return `<span class="cat-icon ${size}" ${tint(cat)}>${icon(cat.icon)}</span>`;
}

export function section(title, inner, { note = '' } = {}) {
  return `
    <section class="section">
      ${title ? `<h2 class="section-title">${esc(title)}</h2>` : ''}
      ${inner}
      ${note ? `<p class="section-note">${note}</p>` : ''}
    </section>`;
}

export function list(rows) {
  return `<div class="list">${rows.join('')}</div>`;
}

export function row({ href, leading = '', title, subtitle = '', trailing = '', dim = false }) {
  const tag = href ? 'a' : 'div';
  return `
    <${tag} class="row ${dim ? 'dim' : ''}" ${href ? `href="#${esc(href)}"` : ''}>
      ${leading}
      <span class="row-text">
        <span class="row-title">${esc(title)}</span>
        ${subtitle ? `<span class="row-subtitle">${esc(subtitle)}</span>` : ''}
      </span>
      ${trailing ? `<span class="row-trailing">${trailing}</span>` : ''}
      ${href ? icon('chevronRight', 'row-chevron') : ''}
    </${tag}>`;
}

export function lessonMeta(a) {
  return `
    <span class="meta">
      <span class="level level-${esc(a.level)}">${LEVELS[a.level] || 'All levels'}</span>
      <span class="meta-dot">·</span>
      <span>${a.readMins} min read</span>
    </span>`;
}

export function lessonRow(a, content, { showPlace = false } = {}) {
  const place = showPlace ? content.placeOf(a) : null;
  return `
    <a class="row lesson-row" href="#${content.lessonPath(a.id)}">
      ${place?.category ? categoryIcon(place.category, 'small') : ''}
      <span class="row-text">
        <span class="row-title">${esc(a.title)}</span>
        <span class="row-subtitle clamp-2">${esc(a.summary)}</span>
        ${lessonMeta(a)}
      </span>
      ${icon('chevronRight', 'row-chevron')}
    </a>`;
}

export function lessonCard(a, content) {
  const { category } = content.placeOf(a);
  return `
    <a class="card lesson-card" href="#${content.lessonPath(a.id)}" ${tint(category)}>
      <span class="card-eyebrow">${category ? categoryIcon(category, 'small') : ''}<span>${esc(category?.title || '')}</span></span>
      <span class="card-title">${esc(a.title)}</span>
      <span class="card-text clamp-3">${esc(a.summary)}</span>
      <span class="card-foot">${a.readMins} min read</span>
    </a>`;
}

export function countLabel(n) {
  return n ? plural(n, 'lesson') : 'Coming soon';
}

export function empty({ iconName = 'info', title, text, extra = '' }) {
  return `
    <div class="empty">
      <span class="empty-icon">${icon(iconName)}</span>
      <h2>${esc(title)}</h2>
      <p>${text}</p>
      ${extra}
    </div>`;
}
