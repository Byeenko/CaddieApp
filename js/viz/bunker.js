// Greenside bunker: where the club enters the sand decides what the ball does.
//
//   ```figure
//   type: bunker
//   plugged: true      (adds the plugged-lie option)
//   ```

import { svg, add, card, segmented, reducedMotion } from './core.js';

const SAND = 112;
const BALL_X = 150;

const MODES = {
  right: {
    label: 'Just right', entry: 128, exit: 180, depth: 7,
    flight: 'M150 108 Q205 -10 300 52', result: 'Sand cushions the ball out, high and soft.', ok: true,
  },
  behind: {
    label: 'Too far behind', entry: 92, exit: 160, depth: 11,
    flight: 'M150 108 Q190 40 228 78', result: 'Too much sand slows the club, and the ball barely gets out, or stays in.', ok: false,
  },
  thin: {
    label: 'Ball first', entry: 149, exit: 186, depth: 1,
    flight: 'M150 108 Q230 70 320 60', result: 'The club catches the ball first and it flies low and fast, over the green or into the lip.', ok: false,
  },
  plugged: {
    label: 'Plugged lie', entry: 140, exit: 166, depth: 15,
    flight: 'M150 112 Q200 40 260 70', result: 'Square or closed face, steep and hard down behind the ball. It comes out low with little spin and runs.', ok: true,
  },
};

export default function bunker(el, params) {
  const { stage, controls } = card(el, {
    kind: 'Animation',
    caption: params.caption || 'Side view. The target is to the right. Tap an option, then play.',
  });
  const box = svg('0 0 320 160');
  stage.append(box);
  add(box, 'path', { d: `M0 ${SAND} L250 ${SAND} Q285 ${SAND} 292 70 L320 64 L320 160 L0 160 Z`, class: 'fill-sand' });
  add(box, 'path', { d: `M292 70 L320 64 L320 160 L292 160 Z`, class: 'fill-grass' });
  add(box, 'text', { x: 8, y: SAND + 22, class: 'fig-tiny' }, 'SAND');
  add(box, 'text', { x: 296, y: 90, class: 'fig-tiny' }, 'GRN');
  const entryMark = add(box, 'line', { y1: SAND - 16, y2: SAND + 4, class: 'line-entry' });
  const entryText = add(box, 'text', { y: SAND - 20, 'text-anchor': 'middle', class: 'fig-tiny' }, 'CLUB ENTERS');
  const clubPath = add(box, 'path', { class: 'club-path' });
  const flight = add(box, 'path', { class: 'flight-path' });
  const ball = add(box, 'circle', { cx: BALL_X, cy: SAND - 4, r: 4.2, class: 'fig-ball' });
  const head = add(box, 'rect', { width: 14, height: 5, rx: 2, class: 'fill-club' });
  const spray = add(box, 'g', { class: 'spray' });
  const readout = document.createElement('div');
  readout.className = 'viz-readout';

  let mode = 'right';
  let anim = 0;

  const draw = () => {
    const m = MODES[mode];
    entryMark.setAttribute('x1', m.entry);
    entryMark.setAttribute('x2', m.entry);
    entryText.setAttribute('x', m.entry);
    clubPath.setAttribute('d', `M${m.entry - 60} ${SAND - 50} Q${m.entry} ${SAND - 4} ${m.entry + 4} ${SAND + m.depth * 0.6} Q${(m.entry + m.exit) / 2} ${SAND + m.depth} ${m.exit} ${SAND} Q${m.exit + 30} ${SAND - 30} ${m.exit + 70} ${SAND - 70}`);
    flight.setAttribute('d', m.flight);
    flight.style.opacity = 0;
    ball.setAttribute('cx', BALL_X);
    ball.setAttribute('cy', mode === 'plugged' ? SAND - 1 : SAND - 4);
    head.setAttribute('x', -40);
    spray.replaceChildren();
    readout.innerHTML = `<span class="viz-caption-inline"><span class="viz-mark-inline ${m.ok ? '' : 'bad'}">${m.ok ? '✓' : '✕'}</span>${m.result}</span>`;
  };

  const play = () => {
    draw();
    cancelAnimationFrame(anim);
    const len = clubPath.getTotalLength();
    const fl = flight.getTotalLength();
    const t0 = performance.now();
    const D1 = reducedMotion() ? 1 : 700;
    const D2 = reducedMotion() ? 1 : 900;
    const dots = [];
    const step = (now) => {
      const t = now - t0;
      if (t <= D1) {
        const p = clubPath.getPointAtLength((t / D1) * len);
        head.setAttribute('x', p.x - 7);
        head.setAttribute('y', p.y - 2.5);
        const m = MODES[mode];
        if (p.x > m.entry && p.x < m.exit && dots.length < 26 && mode !== 'thin') {
          dots.push({ x: p.x, y: SAND - 2, vx: 0.6 + Math.random() * 1.6, vy: -1.8 - Math.random() * 2.2, el: add(spray, 'circle', { r: 1.4, class: 'fill-sand-dark' }) });
        }
      } else {
        head.setAttribute('x', -40);
      }
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.12;
        d.el.setAttribute('cx', d.x);
        d.el.setAttribute('cy', Math.min(d.y, SAND));
      }
      const tb = t - D1 * 0.55;
      if (tb > 0) {
        const p = flight.getPointAtLength(Math.min(1, tb / D2) * fl);
        ball.setAttribute('cx', p.x);
        ball.setAttribute('cy', p.y);
        flight.style.opacity = 0.5;
      }
      if (t < D1 + D2) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };

  const options = Object.entries(MODES).filter(([k]) => k !== 'plugged' || params.plugged === 'true');
  segmented(controls, options.map(([k, v]) => [k, v.label]), params.mode || 'right', (k) => {
    mode = k;
    draw();
  });
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'viz-play';
  btn.setAttribute('aria-label', 'Play');
  btn.addEventListener('click', play);
  controls.prepend(btn);
  controls.append(readout);
  mode = MODES[params.mode] ? params.mode : 'right';
  draw();
}
