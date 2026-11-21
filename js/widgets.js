// Lesson visuals. In a lesson, write a fenced block:
//
//   ```figure
//   type: sequence
//   pressure: true
//   caption: Weight moves to the trail side, then firmly to the lead side.
//   ```
//
// `type` picks a module from js/viz/, and the other lines are passed to it as
// settings. Modules load only when a lesson uses them, so lessons stay fast.
// (The older ```widget name``` form still works.)

const TYPES = {
  sequence: () => import('./viz/sequence.js'),
  compare: () => import('./viz/compare.js'),
  'ball-flight': () => import('./viz/ball-flight.js'),
  slope: () => import('./viz/slope.js'),
  'chip-ratio': () => import('./viz/chip-ratio.js'),
  clock: () => import('./viz/clock.js'),
  'green-read': () => import('./viz/green-read.js'),
  bunker: () => import('./viz/bunker.js'),
};

export function mountWidgets(root) {
  root.querySelectorAll('.widget[data-widget]').forEach(async (el) => {
    let params = {};
    try {
      params = JSON.parse(el.dataset.params || '{}');
    } catch {
      /* ignore bad settings */
    }
    const type = params.type || el.dataset.widget;
    const load = TYPES[type];
    if (!load) return el.remove(); // unknown types stay invisible rather than showing a broken box
    try {
      const mod = await load();
      mod.default(el, params);
    } catch (err) {
      console.error(`Visual "${type}" failed`, err);
      el.remove();
    }
  });
}
