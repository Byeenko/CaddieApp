// Shared drawing tools for lesson visuals: SVG helpers, the stick-figure golfer,
// and the pose library. Everything is drawn in code, so it's tiny, sharp at any
// size, works offline and follows light/dark mode through CSS variables.
//
// Coordinates: 200 × 240 box, ground at y = 222.
//   'face' view — camera in front of the golfer; the TARGET IS TO THE RIGHT.
//   'side' view — down-the-line from behind; the golfer faces right, towards the ball.

export const NS = 'http://www.w3.org/2000/svg';

export function svg(viewBox, cls = '') {
  const el = document.createElementNS(NS, 'svg');
  el.setAttribute('viewBox', viewBox);
  el.setAttribute('class', `viz-svg ${cls}`);
  return el;
}

export function add(parent, tag, attrs = {}, text) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) el.setAttribute(k, v);
  if (text !== undefined) el.textContent = text;
  parent.append(el);
  return el;
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const lerpPt = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const rad = (d) => (d * Math.PI) / 180;

// ---------------------------------------------------------------- poses
// Face-on joints: hd head · nk neck · pv pelvis · sT/sL shoulders · eT/eL elbows ·
// h hands · hT/hL hips · kT/kL knees · aT/aL ankles · tT/tL toes.
// club = angle in degrees (0 = pointing right/towards target, 90 = straight down).
// T = trail (right side of the body, left of the picture), L = lead.

const FEET = { tT: [79, 224], tL: [121, 224] };

export const POSES = {
  address: {
    label: 'Address', view: 'face', club: 92, len: 72, ball: true, pressure: [50, 50],
    hd: [97, 73], nk: [98, 88], pv: [100, 140], sT: [84, 100], sL: [113, 97],
    eT: [89, 126], eL: [111, 124], h: [103, 150], hT: [91, 142], hL: [109, 142],
    kT: [86, 182], kL: [114, 182], aT: [83, 220], aL: [117, 220], ...FEET,
  },
  takeaway: {
    label: 'Takeaway', view: 'face', club: 180, len: 64, ball: true, pressure: [60, 40],
    hd: [96, 74], nk: [97, 88], pv: [99, 140], sT: [87, 99], sL: [109, 98],
    eT: [80, 120], eL: [91, 117], h: [74, 136], hT: [91, 142], hL: [107, 142],
    kT: [86, 182], kL: [112, 182], aT: [83, 220], aL: [117, 220], ...FEET,
  },
  top: {
    label: 'Top', view: 'face', club: -2, len: 64, ball: true, pressure: [70, 30],
    hd: [95, 75], nk: [96, 89], pv: [97, 141], sT: [88, 95], sL: [100, 102],
    eT: [76, 97], eL: [86, 81], h: [72, 60], hT: [91, 142], hL: [104, 142],
    kT: [87, 182], kL: [108, 184], aT: [83, 220], aL: [117, 220], ...FEET,
  },
  downswing: {
    label: 'Downswing', view: 'face', club: -100, len: 64, ball: true, pressure: [35, 65],
    hd: [96, 76], nk: [97, 90], pv: [104, 140], sT: [86, 102], sL: [110, 98],
    eT: [82, 120], eL: [94, 112], h: [80, 126], hT: [95, 142], hL: [113, 141],
    kT: [90, 182], kL: [116, 182], aT: [84, 220], aL: [117, 220], ...FEET,
  },
  impact: {
    label: 'Impact', view: 'face', club: 96.5, len: 70, ball: true, pressure: [20, 80],
    hd: [97, 76], nk: [99, 90], pv: [106, 140], sT: [86, 103], sL: [114, 96],
    eT: [96, 128], eL: [113, 124], h: [108, 152], hT: [97, 142], hL: [115, 141],
    kT: [93, 183], kL: [117, 182], aT: [88, 217], aL: [118, 220], tT: [82, 224], tL: [122, 224],
  },
  release: {
    label: 'Release', view: 'face', club: 0, len: 64, ball: false, pressure: [12, 88],
    hd: [100, 76], nk: [101, 90], pv: [108, 140], sT: [92, 101], sL: [114, 98],
    eT: [110, 122], eL: [124, 118], h: [128, 138], hT: [100, 142], hL: [116, 141],
    kT: [97, 183], kL: [118, 182], aT: [92, 215], aL: [118, 220], tT: [88, 224], tL: [122, 224],
  },
  finish: {
    label: 'Finish', view: 'face', club: 150, len: 64, ball: false, pressure: [8, 92],
    hd: [113, 74], nk: [112, 88], pv: [112, 140], sT: [116, 99], sL: [106, 97],
    eT: [113, 80], eL: [100, 88], h: [100, 64], hT: [106, 141], hL: [116, 140],
    kT: [104, 184], kL: [118, 182], aT: [98, 213], aL: [119, 220], tT: [103, 224], tL: [123, 224],
  },

  // Faults, for comparisons
  'impact-flip': {
    label: 'Flipping', view: 'face', club: 84, len: 72, ball: true, pressure: [60, 40],
    hd: [92, 78], nk: [95, 92], pv: [98, 141], sT: [82, 105], sL: [111, 97],
    eT: [88, 130], eL: [104, 128], h: [99, 151], hT: [89, 143], hL: [107, 142],
    kT: [85, 182], kL: [114, 182], aT: [83, 220], aL: [117, 220], ...FEET,
  },
  'finish-back': {
    label: 'Falling back', view: 'face', club: 160, len: 64, ball: false, pressure: [60, 40],
    hd: [88, 76], nk: [91, 90], pv: [99, 141], sT: [101, 100], sL: [88, 99],
    eT: [97, 82], eL: [88, 90], h: [92, 66], hT: [92, 142], hL: [107, 142],
    kT: [86, 182], kL: [114, 182], aT: [83, 220], aL: [117, 220], ...FEET,
  },
  'chicken-wing': {
    label: 'Chicken wing', view: 'face', club: 20, len: 64, ball: false, pressure: [30, 70],
    hd: [98, 76], nk: [99, 90], pv: [104, 140], sT: [88, 102], sL: [112, 98],
    eT: [106, 124], eL: [130, 108], h: [124, 132], hT: [96, 142], hL: [113, 141],
    kT: [90, 182], kL: [116, 182], aT: [85, 219], aL: [117, 220], ...FEET,
  },
  'top-overswing': {
    label: 'Over-swinging', view: 'face', club: 35, len: 64, ball: true, pressure: [80, 20],
    hd: [93, 75], nk: [94, 89], pv: [94, 141], sT: [86, 95], sL: [98, 103],
    eT: [72, 92], eL: [80, 76], h: [76, 54], hT: [86, 142], hL: [102, 142],
    kT: [84, 182], kL: [106, 184], aT: [83, 220], aL: [117, 215], tT: [79, 224], tL: [124, 224],
  },

  // Down-the-line posture views
  'posture-good': {
    label: 'Athletic posture', view: 'side', club: 56.3, len: 86, ball: true,
    hd: [110, 85], nk: [101, 94], sh: [96, 99], el: [99, 124], h: [102, 150],
    pv: [66, 142], kn: [86, 184], an: [78, 220], to: [97, 224],
  },
  'posture-hunched': {
    label: 'Hunched, legs locked', view: 'side', club: 52, len: 78, ball: true, curve: [74, 100],
    hd: [113, 110], nk: [104, 112], sh: [100, 112], el: [103, 136], h: [106, 160],
    pv: [72, 140], kn: [77, 182], an: [78, 220], to: [97, 224],
  },
  'posture-upright': {
    label: 'Too upright', view: 'side', club: 63, len: 80, ball: true,
    hd: [92, 72], nk: [86, 88], sh: [84, 94], el: [86, 122], h: [90, 150],
    pv: [72, 140], kn: [84, 182], an: [78, 220], to: [97, 224],
  },
};

export const SWING = ['address', 'takeaway', 'top', 'downswing', 'impact', 'release', 'finish'];

/** Blend two face-on poses. */
export function blend(a, b, t) {
  const out = { ...a };
  for (const k of Object.keys(a)) {
    if (Array.isArray(a[k]) && Array.isArray(b[k]) && a[k].length === 2) out[k] = lerpPt(a[k], b[k], t);
  }
  let d = b.club - a.club; // turn the club the short way round
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  out.club = a.club + d * t;
  out.len = lerp(a.len, b.len, t);
  out.pressure = a.pressure && b.pressure ? [lerp(a.pressure[0], b.pressure[0], t), lerp(a.pressure[1], b.pressure[1], t)] : a.pressure;
  out.ball = t < 0.5 ? a.ball : b.ball;
  return out;
}

// ---------------------------------------------------------------- drawing

const line = (g, a, b, cls) => add(g, 'line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: cls });
const poly = (g, pts, cls) => add(g, 'polyline', { points: pts.map((p) => p.join(',')).join(' '), class: cls });

export function clubEnd(p) {
  return [p.h[0] + Math.cos(rad(p.club)) * p.len, p.h[1] + Math.sin(rad(p.club)) * p.len];
}

/** Draws a golfer into an SVG group. Returns the group. */
export function drawGolfer(parent, p, { ghost = false, ball = true } = {}) {
  const g = add(parent, 'g', { class: `golfer ${ghost ? 'golfer-ghost' : ''}` });
  if (p.view === 'side') {
    poly(g, [p.to, p.an, p.kn, p.pv], 'fig-limb');
    if (p.curve) add(g, 'path', { d: `M${p.pv} Q${p.curve} ${p.sh}`, class: 'fig-limb' });
    else line(g, p.pv, p.sh, 'fig-limb');
    line(g, p.sh, p.nk, 'fig-limb');
    poly(g, [p.sh, p.el, p.h], 'fig-limb fig-arm');
  } else {
    poly(g, [p.tT, p.aT, p.kT, p.hT], 'fig-limb fig-back');
    poly(g, [p.tL, p.aL, p.kL, p.hL], 'fig-limb');
    line(g, p.hT, p.hL, 'fig-limb');
    line(g, p.pv, p.nk, 'fig-limb');
    line(g, p.sT, p.sL, 'fig-limb');
    poly(g, [p.sT, p.eT, p.h], 'fig-limb fig-arm fig-back');
    poly(g, [p.sL, p.eL, p.h], 'fig-limb fig-arm');
  }
  add(g, 'circle', { cx: p.hd[0], cy: p.hd[1], r: 10, class: 'fig-head' });
  const end = clubEnd(p);
  line(g, p.h, end, 'fig-club');
  // club head: a short blade at the end of the shaft
  const a = rad(p.club + 90);
  add(g, 'line', {
    x1: end[0] - Math.cos(a) * 1, y1: end[1] - Math.sin(a) * 1,
    x2: end[0] + Math.cos(a) * 7, y2: end[1] + Math.sin(a) * 7, class: 'fig-clubhead',
  });
  if (ball && p.ball) {
    const [bx, by] = p.ballAt || (p.view === 'side' ? [end[0] + 5, 219.5] : [100, 219.5]);
    add(g, 'circle', { cx: bx, cy: by, r: 3.6, class: 'fig-ball' });
  }
  return g;
}

export function drawGround(parent, { view = 'face', target = true } = {}) {
  add(parent, 'line', { x1: 8, y1: 224, x2: 192, y2: 224, class: 'fig-ground' });
  if (target && view === 'face') {
    add(parent, 'text', { x: 188, y: 18, 'text-anchor': 'end', class: 'fig-label fig-accent' }, 'TARGET →');
  }
  if (target && view === 'side') {
    add(parent, 'text', { x: 188, y: 18, 'text-anchor': 'end', class: 'fig-label' }, 'DOWN THE LINE');
  }
}

/** Two pressure bars under the feet. pressure = [trail%, lead%] */
export function drawPressure(parent) {
  const g = add(parent, 'g', { class: 'fig-pressure' });
  const bars = [];
  for (const [i, x] of [[0, 56], [1, 144]]) {
    add(g, 'rect', { x: x - 4, y: 182, width: 8, height: 36, rx: 4, class: 'fig-bar-bg' });
    const fill = add(g, 'rect', { x: x - 4, y: 218, width: 8, height: 0, rx: 4, class: 'fig-bar' });
    const txt = add(g, 'text', { x, y: 176, 'text-anchor': 'middle', class: 'fig-small' }, '');
    bars.push({ fill, txt, i });
  }
  add(g, 'text', { x: 56, y: 236, 'text-anchor': 'middle', class: 'fig-tiny' }, 'TRAIL');
  add(g, 'text', { x: 144, y: 236, 'text-anchor': 'middle', class: 'fig-tiny' }, 'LEAD');
  return (pressure) => {
    for (const b of bars) {
      const v = pressure[b.i];
      const h = (36 * v) / 100;
      b.fill.setAttribute('y', 218 - h);
      b.fill.setAttribute('height', h);
      b.txt.textContent = `${Math.round(v / 5) * 5}%`;
    }
  };
}

// ---------------------------------------------------------------- UI helpers

/** The card every visual sits in, so they all look the same. */
export function card(el, { kind = 'Diagram', caption = '' } = {}) {
  el.classList.add('viz');
  el.innerHTML = `
    <div class="viz-head"><span class="viz-kind">${kind}</span></div>
    <div class="viz-stage"></div>
    <div class="viz-controls"></div>
    ${caption ? `<p class="viz-caption">${caption}</p>` : ''}`;
  return {
    stage: el.querySelector('.viz-stage'),
    controls: el.querySelector('.viz-controls'),
    head: el.querySelector('.viz-head'),
  };
}

/** A row of segmented buttons. Calls onPick(value). */
export function segmented(parent, options, active, onPick) {
  const wrap = document.createElement('div');
  wrap.className = 'segmented';
  wrap.setAttribute('role', 'tablist');
  for (const [value, label] of options) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.dataset.value = value;
    b.setAttribute('role', 'tab');
    if (value === active) b.classList.add('on');
    b.addEventListener('click', () => {
      wrap.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      onPick(value);
    });
    wrap.append(b);
  }
  parent.append(wrap);
  return {
    set(value) {
      wrap.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.value === String(value)));
    },
  };
}

export function slider(parent, { label, min, max, step = 1, value, format = (v) => v, onInput }) {
  const row = document.createElement('label');
  row.className = 'viz-slider';
  row.innerHTML = `<span class="viz-slider-label">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output></output>`;
  const input = row.querySelector('input');
  const out = row.querySelector('output');
  const update = () => {
    out.textContent = format(Number(input.value));
    onInput(Number(input.value));
  };
  input.addEventListener('input', update);
  parent.append(row);
  out.textContent = format(value);
  return {
    set(v) {
      input.value = v;
      update();
    },
  };
}

/** Only animate while the visual is on screen, and respect Reduce Motion. */
export const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function whenVisible(el, onShow, onHide) {
  if (!('IntersectionObserver' in window)) return onShow();
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? onShow() : onHide?.()), { threshold: 0.3 });
  io.observe(el);
}
