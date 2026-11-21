// Animated swing sequence: a stick-figure golfer moving through key positions,
// with optional weight-shift bars under the feet. Tap a position to freeze it.
//
//   ```figure
//   type: sequence
//   poses: address, top, impact, finish     (optional, default = full swing)
//   pressure: true                           (show weight bars)
//   focus: impact                            (pose shown before playing)
//   caption: …
//   ```

import { POSES, SWING, svg, add, drawGolfer, drawGround, drawPressure, blend, ease, card, reducedMotion, whenVisible } from './core.js';

// Real swings take roughly 3× as long going back as coming down (see Tempo & Rhythm).
const SEGMENT_MS = {
  'address>takeaway': 520, 'takeaway>top': 520, 'top>downswing': 190, 'downswing>impact': 110,
  'impact>release': 120, 'release>finish': 380,
};

export default function sequence(el, params) {
  const names = (params.poses ? params.poses.split(',').map((s) => s.trim()) : SWING).filter((n) => POSES[n]);
  const showPressure = params.pressure === 'true';
  const { stage, controls } = card(el, {
    kind: params.kind || 'Animation',
    caption: params.caption || (showPressure ? 'Bars show roughly how weight (pressure) is shared between the feet.' : ''),
  });

  const box = svg('0 0 200 240');
  stage.append(box);
  drawGround(box);
  const setPressure = showPressure ? drawPressure(box) : null;
  let figure = null;
  const label = add(box, 'text', { x: 12, y: 18, class: 'fig-label' }, '');

  const render = (pose, name) => {
    figure?.remove();
    figure = drawGolfer(box, pose);
    label.textContent = (name || '').toUpperCase();
    setPressure?.(pose.pressure || [50, 50]);
  };

  // Controls: play/pause + a chip per position
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'viz-play';
  play.setAttribute('aria-label', 'Play');
  const chips = document.createElement('div');
  chips.className = 'viz-chips';
  controls.append(play, chips);

  const chipEls = names.map((n, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'viz-chip';
    b.textContent = POSES[n].label;
    b.addEventListener('click', () => {
      stop();
      show(i);
    });
    chips.append(b);
    return b;
  });

  const show = (i) => {
    render(POSES[names[i]], POSES[names[i]].label);
    chipEls.forEach((c, j) => c.classList.toggle('on', j === i));
  };

  // Animation
  let raf = 0;
  let running = false;
  let startedAt = 0;
  const segments = [];
  for (let i = 0; i < names.length - 1; i++) {
    const key = `${names[i]}>${names[i + 1]}`;
    segments.push({ from: i, to: i + 1, ms: SEGMENT_MS[key] || 450 });
  }
  const HOLD_END = 1100;
  const HOLD_START = 500;
  const total = HOLD_START + segments.reduce((s, x) => s + x.ms, 0) + HOLD_END;

  const frame = (now) => {
    let t = (now - startedAt) % total;
    if (t < HOLD_START) {
      show(0);
    } else {
      t -= HOLD_START;
      let done = false;
      for (const s of segments) {
        if (t <= s.ms) {
          const k = ease(t / s.ms);
          render(blend(POSES[names[s.from]], POSES[names[s.to]], k), POSES[names[k < 0.5 ? s.from : s.to]].label);
          chipEls.forEach((c, j) => c.classList.toggle('on', j === (k < 0.5 ? s.from : s.to)));
          done = true;
          break;
        }
        t -= s.ms;
      }
      if (!done) show(names.length - 1);
    }
    if (running) raf = requestAnimationFrame(frame);
  };

  function start() {
    if (running) return;
    running = true;
    startedAt = performance.now();
    play.classList.add('playing');
    play.setAttribute('aria-label', 'Pause');
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    play.classList.remove('playing');
    play.setAttribute('aria-label', 'Play');
  }
  play.addEventListener('click', () => (running ? stop() : start()));

  const first = Math.max(0, names.indexOf(params.focus));
  show(first);
  // Autoplay once when scrolled into view (unless Reduce Motion is on); pause when off screen.
  let autoplayed = false;
  whenVisible(
    el,
    () => {
      if (!autoplayed && !reducedMotion() && params.autoplay !== 'false') {
        autoplayed = true;
        start();
      }
    },
    stop
  );
}
