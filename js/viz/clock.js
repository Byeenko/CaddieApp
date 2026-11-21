// The clock system for wedge distances: backswing to 7:30, 9:00 or 10:30.
//
//   ```figure
//   type: clock
//   ```

import { POSES, svg, add, drawGolfer, drawGround, card, segmented } from './core.js';

const POS = {
  '7:30': { arm: 135, club: 160, label: 'Short' },
  '9:00': { arm: 180, club: -95, label: 'Medium' },
  '10:30': { arm: 222, club: -30, label: 'Long' },
};

export default function clock(el, params) {
  const { stage, controls } = card(el, {
    kind: 'Interactive',
    caption: params.caption || 'Face-on view. Your lead arm is the hand of the clock. Same tempo every time; only the length changes.',
  });
  const box = svg('0 0 200 240');
  stage.append(box);
  const C = [99, 114];
  const R = 64;

  const draw = (k) => {
    box.replaceChildren();
    drawGround(box);
    add(box, 'circle', { cx: C[0], cy: C[1], r: R, class: 'clock-face' });
    for (const [name, p] of Object.entries(POS)) {
      const a = (p.arm * Math.PI) / 180;
      const x = C[0] + Math.cos(a) * (R + 9);
      const y = C[1] + Math.sin(a) * (R + 9);
      add(box, 'text', { x, y: y + 3, 'text-anchor': 'middle', class: `fig-small ${name === k ? 'fig-accent' : ''}` }, name);
    }
    add(box, 'text', { x: C[0], y: C[1] - R - 4, 'text-anchor': 'middle', class: 'fig-tiny' }, '12');
    const p = POS[k];
    const a = (p.arm * Math.PI) / 180;
    const base = POSES.address;
    const sL = [base.sL[0] - 6, base.sL[1] + 2];
    const h = [C[0] + Math.cos(a) * 52, C[1] + Math.sin(a) * 52];
    const pose = {
      ...base,
      ball: true,
      sL,
      h,
      eL: [(sL[0] + h[0]) / 2, (sL[1] + h[1]) / 2],
      eT: [(base.sT[0] + h[0]) / 2 - 4, (base.sT[1] + h[1]) / 2 + 8],
      club: p.club,
      len: 56,
    };
    drawGolfer(box, pose);
  };

  segmented(controls, Object.entries(POS).map(([k, v]) => [k, `${k} · ${v.label}`]), params.position || '9:00', draw);
  draw(params.position || '9:00');
}
