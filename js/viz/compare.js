// Side-by-side "do this / not this" stick figures.
//
//   ```figure
//   type: compare
//   good: posture-good
//   bad: posture-hunched
//   good-label: Flat back, soft knees     (optional)
//   bad-label: Rounded back, locked knees (optional)
//   pressure: true                        (optional weight bars)
//   ```

import { POSES, svg, add, drawGolfer, drawGround, drawPressure, card } from './core.js';

export default function compare(el, params) {
  const { stage } = card(el, { kind: 'Compare', caption: params.caption || '' });
  stage.classList.add('viz-compare');
  el.classList.add('viz-zoomable');
  for (const which of ['good', 'bad']) {
    const pose = POSES[params[which]];
    if (!pose) continue;
    const cell = document.createElement('figure');
    cell.className = `viz-cell viz-${which}`;
    const box = svg('0 0 200 240');
    drawGround(box, { view: pose.view, target: false });
    if (params.pressure === 'true') drawPressure(box)(pose.pressure || [50, 50]);
    drawGolfer(box, pose);
    cell.append(box);
    const cap = document.createElement('figcaption');
    cap.innerHTML = `<span class="viz-mark">${which === 'good' ? '✓' : '✕'}</span>${params[`${which}-label`] || pose.label}`;
    cell.append(cap);
    stage.append(cell);
  }
}
