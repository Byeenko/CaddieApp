// Interactive demos that can be dropped into any lesson with:
//
//   ```widget
//   ball-flight
//   ```
//
// Each widget is a function that receives its container element. Phase 3 adds the
// real ones (ball position slider, ball-flight laws, slope effects, etc.).

const WIDGETS = {
  // 'ball-flight': (el) => { ... },
};

export function mountWidgets(root) {
  root.querySelectorAll('.widget[data-widget]').forEach((el) => {
    const fn = WIDGETS[el.dataset.widget];
    if (fn) fn(el);
    else el.remove(); // unknown widgets stay invisible rather than showing a broken box
  });
}
