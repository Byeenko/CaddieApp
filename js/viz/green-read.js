// Speed and break: the same putt hit softer breaks more, so it needs more aim.
//
//   ```figure
//   type: green-read
//   ```

import { svg, add, card, slider } from './core.js';

const SPEEDS = [
  { name: 'Dying at the hole', brk: 34, past: 0 },
  { name: 'Soft', brk: 28, past: 6 },
  { name: 'Ideal (about 40 cm past)', brk: 22, past: 14 },
  { name: 'Firm', brk: 15, past: 30 },
  { name: 'Charging', brk: 9, past: 48 },
];

export default function greenRead(el, params) {
  const { stage, controls } = card(el, {
    kind: 'Interactive',
    caption: params.caption || 'Top-down view of a putt across a slope that falls from left to right. Slide the speed.',
  });
  const box = svg('0 0 200 240');
  stage.append(box);
  add(box, 'ellipse', { cx: 100, cy: 124, rx: 96, ry: 116, class: 'fill-green' });
  // slope arrows
  for (const y of [70, 150]) {
    add(box, 'line', { x1: 22, y1: y, x2: 48, y2: y + 6, class: 'line-slope' });
    add(box, 'path', { d: `M48 ${y + 6} l-7 -5 l-1 7 z`, class: 'fill-muted' });
  }
  add(box, 'text', { x: 18, y: 62, class: 'fig-tiny' }, 'SLOPE');
  const HOLE = [100, 44];
  const BALL = [100, 214];
  add(box, 'circle', { cx: HOLE[0], cy: HOLE[1], r: 5, class: 'fill-hole' });
  add(box, 'circle', { cx: HOLE[0], cy: HOLE[1], r: 15, class: 'zone' });
  const aimLine = add(box, 'line', { x1: BALL[0], y1: BALL[1], class: 'line-guide' });
  const aimMark = add(box, 'g', {});
  add(aimMark, 'circle', { r: 4, class: 'aim-mark' });
  add(aimMark, 'text', { x: 0, y: -8, 'text-anchor': 'middle', class: 'fig-tiny' }, 'AIM');
  const path = add(box, 'path', { class: 'flight-path roll' });
  const end = add(box, 'circle', { r: 3.6, class: 'fig-ball' });
  add(box, 'circle', { cx: BALL[0], cy: BALL[1], r: 3.6, class: 'fill-muted' });
  const readout = document.createElement('div');
  readout.className = 'viz-readout';

  const update = (i) => {
    const s = SPEEDS[i];
    const aimX = HOLE[0] - s.brk * 1.25;
    aimLine.setAttribute('x2', aimX);
    aimLine.setAttribute('y2', HOLE[1] - 6);
    aimMark.setAttribute('transform', `translate(${aimX} ${HOLE[1] - 6})`);
    const stop = [HOLE[0] + s.past * 0.18, HOLE[1] - s.past];
    path.setAttribute('d', `M${BALL[0]} ${BALL[1]} Q${HOLE[0] - s.brk * 2.1} ${HOLE[1] + 40} ${HOLE[0]} ${HOLE[1]} L${stop[0]} ${stop[1]}`);
    end.setAttribute('cx', stop[0]);
    end.setAttribute('cy', stop[1]);
    const cups = Math.max(1, Math.round(s.brk / 7));
    readout.innerHTML = `<span class="viz-pill">Aim about ${cups} cup${cups === 1 ? '' : 's'} left</span><span class="viz-pill ${i === 0 || i === 4 ? 'warn' : ''}">${s.name}</span>`;
  };

  slider(controls, { label: 'Speed', min: 0, max: 4, value: 2, format: (v) => ['Dying', 'Soft', 'Ideal', 'Firm', 'Charging'][v], onInput: update });
  controls.append(readout);
  update(2);
}
