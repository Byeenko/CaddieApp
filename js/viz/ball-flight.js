// Interactive ball-flight laws: drag face angle and swing path and watch the shot.
//
//   ```figure
//   type: ball-flight
//   preset: slice        (optional starting shot: straight, draw, fade, slice, hook, push, pull)
//   ```

import { svg, add, card, segmented, slider } from './core.js';

const PRESETS = {
  straight: [0, 0], draw: [1, 5], fade: [-1, -5], slice: [3, -7], hook: [-3, 5], push: [4, 4], pull: [-4, -4],
};

function shotName(start, curve) {
  const s = start < -1.5 ? 'pull' : start > 1.5 ? 'push' : '';
  const big = Math.abs(curve) > 5;
  const c = curve < -1 ? (big ? 'hook' : 'draw') : curve > 1 ? (big ? 'slice' : 'fade') : '';
  if (!s && !c) return 'Straight';
  if (!s) return c[0].toUpperCase() + c.slice(1);
  if (!c) return s[0].toUpperCase() + s.slice(1);
  return `${s[0].toUpperCase() + s.slice(1)}-${c}`;
}

const side = (v, pos, neg) => (Math.abs(v) < 0.5 ? 'square' : `${Math.abs(v)}° ${v > 0 ? pos : neg}`);

export default function ballFlight(el, params) {
  const { stage, controls } = card(el, {
    kind: 'Interactive',
    caption: params.caption || 'Drag the sliders, or tap a shot. Top-down view of a right-handed golfer; the flag is the target.',
  });
  const box = svg('0 0 200 250');
  stage.append(box);

  // rough, fairway and target line
  add(box, 'rect', { x: 0, y: 0, width: 200, height: 250, class: 'fill-rough' });
  add(box, 'path', { d: 'M70 250 C70 160 62 80 58 10 L142 10 C138 80 130 160 130 250 Z', class: 'fill-fairway' });
  add(box, 'line', { x1: 100, y1: 238, x2: 100, y2: 22, class: 'line-guide' });
  add(box, 'line', { x1: 100, y1: 8, x2: 100, y2: 24, class: 'line-flag' });
  add(box, 'path', { d: 'M100 8 L111 12 L100 16 Z', class: 'fill-accent' });
  add(box, 'text', { x: 96, y: 16, 'text-anchor': 'end', class: 'fig-small' }, 'TARGET');
  const path = add(box, 'path', { class: 'flight-path' });
  const ball = add(box, 'circle', { r: 4, class: 'fig-ball' });
  add(box, 'circle', { cx: 100, cy: 238, r: 3, class: 'fill-muted' });

  // little club diagram at the bottom: face line + path arrow
  const club = add(box, 'g', { transform: 'translate(30 214)' });
  add(club, 'text', { x: 0, y: -18, 'text-anchor': 'middle', class: 'fig-tiny' }, 'AT IMPACT');
  const pathArrow = add(club, 'line', { x1: 0, y1: 14, x2: 0, y2: -12, class: 'line-path', 'marker-end': '' });
  const face = add(club, 'line', { x1: -11, y1: 0, x2: 11, y2: 0, class: 'line-face' });
  add(club, 'circle', { cx: 0, cy: 0, r: 2.6, class: 'fig-ball' });

  const readout = document.createElement('div');
  readout.className = 'viz-readout';

  let F = 0;
  let P = 0;
  let driver = params.club === 'driver';

  const update = () => {
    const w = driver ? 0.85 : 0.75; // how much the face controls start direction
    const start = w * F + (1 - w) * P;
    const curve = F - P;
    const D = 205;
    const k = driver ? 3.6 : 2.6;
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      const x = 100 + Math.tan((start * Math.PI) / 180) * D * t * 1.6 + k * curve * t * t;
      pts.push([Math.max(4, Math.min(196, x)), 238 - D * t]);
    }
    path.setAttribute('d', 'M' + pts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join(' L'));
    const end = pts[pts.length - 1];
    ball.setAttribute('cx', end[0]);
    ball.setAttribute('cy', end[1]);
    path.classList.remove('draw');
    void path.getBBox();
    path.classList.add('draw');
    face.setAttribute('transform', `rotate(${F * 2.5})`);
    pathArrow.setAttribute('transform', `rotate(${P * 2.5})`);
    const name = shotName(start, curve);
    const fp = curve === 0 ? 'face matches path: no curve' : `face ${Math.abs(curve)}° ${curve > 0 ? 'open' : 'closed'} to path → curves ${curve > 0 ? 'right' : 'left'}`;
    readout.innerHTML = `<span class="viz-pill ${/slice|hook/i.test(name) ? 'warn' : ''}">${name}</span><span class="viz-pill">${fp}</span>`;
  };

  const presets = segmented(
    controls,
    Object.keys(PRESETS).map((k) => [k, k[0].toUpperCase() + k.slice(1)]),
    params.preset || 'straight',
    (k) => {
      [F, P] = PRESETS[k];
      faceSlider.set(F);
      pathSlider.set(P);
    }
  );
  const faceSlider = slider(controls, {
    label: 'Face', min: -8, max: 8, value: 0, format: (v) => side(v, 'open', 'closed'),
    onInput: (v) => { F = v; presets.set(''); update(); },
  });
  const pathSlider = slider(controls, {
    label: 'Path', min: -10, max: 10, value: 0, format: (v) => (v === 0 ? 'neutral' : v > 0 ? `${v}° in-out` : `${-v}° out-in`),
    onInput: (v) => { P = v; presets.set(''); update(); },
  });
  segmented(controls, [['iron', 'Iron'], ['driver', 'Driver']], driver ? 'driver' : 'iron', (v) => {
    driver = v === 'driver';
    update();
  });
  controls.append(readout);

  [F, P] = PRESETS[params.preset] || [0, 0];
  faceSlider.set(F);
  pathSlider.set(P);
  presets.set(params.preset || 'straight');
}
