// Tap a diagram to see it full-screen; pinch to zoom further. Interactive visuals
// aren't zoomable (their controls need to stay put), so this covers static diagrams
// and side-by-side comparisons.

import { icon } from './icons.js';

export function enableZoom(root) {
  const targets = root.querySelectorAll('.prose .figure, .prose .viz-zoomable');
  targets.forEach((el) => {
    if (el.dataset.zoom) return;
    el.dataset.zoom = '1';
    el.insertAdjacentHTML('beforeend', `<span class="zoom-hint" aria-hidden="true">${icon('search')}</span>`);
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Enlarge diagram');
    el.addEventListener('click', () => open(el));
  });
}

function open(el) {
  const art = el.querySelector('svg, img');
  if (!art) return;
  const caption = el.querySelector('figcaption, .viz-caption')?.textContent || '';
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = `<button type="button" class="lightbox-close">Done</button><div class="lightbox-body"></div>${caption ? `<p class="lightbox-caption"></p>` : ''}`;
  const body = box.querySelector('.lightbox-body');
  const stage = el.querySelector('.viz-compare');
  body.append(stage ? stage.cloneNode(true) : art.cloneNode(true));
  if (caption) box.querySelector('.lightbox-caption').textContent = caption;
  const close = () => {
    box.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => e.key === 'Escape' && close();
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.addEventListener('click', (e) => e.target === box && close());
  document.addEventListener('keydown', onKey);
  document.body.append(box);
}
