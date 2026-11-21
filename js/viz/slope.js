// Uneven lies: pick a slope and see how the setup and ball flight change.
//
//   ```figure
//   type: slope
//   lie: uphill        (uphill, downhill, above, below)
//   ```

import { POSES, svg, add, drawGolfer, card, segmented } from './core.js';

const LIES = {
  uphill: {
    label: 'Uphill', view: 'face', tilt: -9, ballX: 106,
    flight: ['Higher', 'Shorter', 'Tends left'],
    adjust: ['Shoulders parallel to the slope', 'Ball a touch forward', 'One or two more clubs; aim right'],
  },
  downhill: {
    label: 'Downhill', view: 'face', tilt: 9, ballX: 94,
    flight: ['Lower', 'Runs further', 'Tends right'],
    adjust: ['Shoulders parallel to the slope', 'Ball a touch back', 'Less club; aim left; swing down the slope'],
  },
  above: {
    label: 'Above feet', view: 'side', slope: -10,
    flight: ['Tends left (draw/hook)'],
    adjust: ['Stand taller; grip down', 'Aim right of target', 'Flatter, more rounded swing'],
  },
  below: {
    label: 'Below feet', view: 'side', slope: 10,
    flight: ['Tends right (fade/slice)', 'Often a little shorter'],
    adjust: ['More knee flex; stay down', 'Aim left of target', 'Take a little more club'],
  },
};

function drawLie(box, lie) {
  box.replaceChildren();
  const L = LIES[lie];
  if (L.view === 'face') {
    const t = (L.tilt * Math.PI) / 180;
    const y = (x) => 222 + Math.tan(t) * (x - 100);
    add(box, 'path', { d: `M0 ${y(0)} L200 ${y(200)} L200 240 L0 240 Z`, class: 'fill-grass' });
    add(box, 'line', { x1: 0, y1: y(0), x2: 200, y2: y(200), class: 'fig-ground' });
    const g = add(box, 'g', { transform: `rotate(${L.tilt} 100 222)` });
    drawGolfer(g, POSES.address, { ball: false });
    add(box, 'circle', { cx: L.ballX, cy: y(L.ballX) - 3.6, r: 3.6, class: 'fig-ball' });
    add(box, 'text', { x: 188, y: 18, 'text-anchor': 'end', class: 'fig-label fig-accent' }, 'TARGET →');
    add(box, 'text', { x: 12, y: 18, class: 'fig-label' }, `${L.label.toUpperCase()} LIE`);
  } else {
    // down-the-line: ground slopes towards / away from the ball
    const t = (L.slope * Math.PI) / 180;
    const y = (x) => 222 + Math.tan(t) * (x - 80);
    add(box, 'path', { d: `M0 ${y(0)} L200 ${y(200)} L200 240 L0 240 Z`, class: 'fill-grass' });
    add(box, 'line', { x1: 0, y1: y(0), x2: 200, y2: y(200), class: 'fig-ground' });
    const ball = [150, y(150) - 3.6];
    const base = POSES['posture-good'];
    const lift = lie === 'above' ? -8 : 6; // stand taller vs more knee flex
    const pose = { ...base, ballAt: ball };
    for (const k of ['hd', 'nk', 'sh', 'el', 'h', 'pv']) pose[k] = [base[k][0], base[k][1] + lift];
    pose.kn = [base.kn[0] + (lie === 'below' ? 4 : 0), base.kn[1] + lift / 2];
    const dx = ball[0] - pose.h[0];
    const dy = ball[1] + 2 - pose.h[1];
    pose.club = (Math.atan2(dy, dx) * 180) / Math.PI;
    pose.len = Math.hypot(dx, dy) - 3;
    drawGolfer(box, pose);
    add(box, 'text', { x: 12, y: 18, class: 'fig-label' }, `BALL ${L.label.toUpperCase()}`);
  }
}

export default function slope(el, params) {
  const { stage, controls } = card(el, { kind: 'Interactive', caption: params.caption || '' });
  const box = svg('0 0 200 240');
  stage.append(box);
  const info = document.createElement('div');
  info.className = 'viz-readout';

  const show = (lie) => {
    drawLie(box, lie);
    const L = LIES[lie];
    info.innerHTML =
      L.flight.map((f) => `<span class="viz-pill">${f}</span>`).join('') +
      `<ul class="viz-list">${L.adjust.map((a) => `<li>${a}</li>`).join('')}</ul>`;
  };
  const start = LIES[params.lie] ? params.lie : 'uphill';
  segmented(controls, Object.entries(LIES).map(([k, v]) => [k, v.label]), start, show);
  controls.append(info);
  show(start);
}
