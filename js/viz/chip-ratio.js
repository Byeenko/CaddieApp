// Chipping carry-to-roll: pick a club and see how far it flies vs rolls to the same hole.
//
//   ```figure
//   type: chip-ratio
//   ```

import { svg, add, card, segmented, reducedMotion } from './core.js';

const CLUBS = [
  ['sw', 'Sand wedge', 1, 34],
  ['pw', 'Pitching wedge', 2, 26],
  ['9i', '9-iron', 3, 21],
  ['8i', '8-iron', 4, 17],
  ['7i', '7-iron', 5, 14],
];

export default function chipRatio(el, params) {
  const { stage, controls } = card(el, {
    kind: 'Interactive',
    caption: params.caption || 'Same chip, same hole: lower-lofted clubs fly less and roll more. Rough guide for a flat green at normal speed.',
  });
  const box = svg('0 0 320 130');
  stage.append(box);
  const G = 104; // ground
  add(box, 'rect', { x: 0, y: G, width: 54, height: 26, class: 'fill-rough' });
  add(box, 'rect', { x: 54, y: G, width: 266, height: 26, class: 'fill-green' });
  add(box, 'text', { x: 6, y: G + 17, class: 'fig-tiny' }, 'FRINGE');
  add(box, 'text', { x: 60, y: G + 17, class: 'fig-tiny' }, 'GREEN');
  add(box, 'line', { x1: 0, y1: G, x2: 320, y2: G, class: 'fig-ground' });
  const HOLE = 290;
  add(box, 'line', { x1: HOLE, y1: G, x2: HOLE, y2: 52, class: 'line-flag' });
  add(box, 'path', { d: `M${HOLE} 52 L${HOLE + 14} 57 L${HOLE} 62 Z`, class: 'fill-accent' });
  add(box, 'ellipse', { cx: HOLE, cy: G, rx: 5, ry: 1.6, class: 'fill-hole' });

  const arc = add(box, 'path', { class: 'flight-path' });
  const roll = add(box, 'line', { class: 'roll-path' });
  const land = add(box, 'circle', { r: 3, class: 'fill-accent' });
  const ball = add(box, 'circle', { r: 3.6, class: 'fig-ball' });
  const carryLbl = add(box, 'text', { 'text-anchor': 'middle', class: 'fig-small' });
  const rollLbl = add(box, 'text', { 'text-anchor': 'middle', class: 'fig-small' });
  const readout = document.createElement('div');
  readout.className = 'viz-readout';
  let anim = 0;

  const show = (id) => {
    const [, name, r, apexH] = CLUBS.find((c) => c[0] === id);
    const startX = 30;
    const total = HOLE - startX;
    const carry = total / (1 + r);
    const lx = startX + carry;
    const apex = [startX + carry / 2, G - apexH * 1.6];
    arc.setAttribute('d', `M${startX} ${G - 3} Q${apex[0]} ${apex[1]} ${lx} ${G - 3}`);
    roll.setAttribute('x1', lx);
    roll.setAttribute('y1', G - 3);
    roll.setAttribute('x2', HOLE);
    roll.setAttribute('y2', G - 3);
    land.setAttribute('cx', lx);
    land.setAttribute('cy', G);
    carryLbl.setAttribute('x', startX + carry / 2);
    carryLbl.setAttribute('y', Math.max(12, apex[1] / 2 + G / 2 - 18));
    carryLbl.textContent = 'carry';
    rollLbl.setAttribute('x', (lx + HOLE) / 2);
    rollLbl.setAttribute('y', G - 10);
    rollLbl.textContent = 'roll';
    readout.innerHTML = `<span class="viz-pill">${name}: carry 1 : roll ${r}</span>`;

    // ball travels along the flight then rolls
    cancelAnimationFrame(anim);
    const t0 = performance.now();
    const dur = reducedMotion() ? 1 : 1400;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const split = 0.45;
      let x, y;
      if (t < split) {
        const u = t / split;
        x = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * apex[0] + u * u * lx;
        y = (1 - u) * (1 - u) * (G - 3) + 2 * (1 - u) * u * apex[1] + u * u * (G - 3);
      } else {
        const u = 1 - Math.pow(1 - (t - split) / (1 - split), 2);
        x = lx + (HOLE - lx) * u;
        y = G - 3;
      }
      ball.setAttribute('cx', x);
      ball.setAttribute('cy', y);
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };

  segmented(controls, CLUBS.map(([id, name]) => [id, id.toUpperCase().replace('I', '-iron').replace('SW', 'SW').replace('PW', 'PW')]), params.club || '9i', show);
  controls.append(readout);
  show(params.club || '9i');
}
