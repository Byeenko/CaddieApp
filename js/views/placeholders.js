// Screens that exist in the navigation now and get built in later phases.

import { esc } from '../util.js';
import { empty, section, list, row } from './components.js';

export async function caddieView({ config }) {
  const planned = [
    ['Live distances', `Front, centre and back of the green in ${esc(config.units)}`],
    ['Hazards', 'Carry and lay-up distances to bunkers and water'],
    ['Works offline', 'Course maps saved to your phone before the round'],
    ['Comp-safe', 'Distance-only, legal under most competition rules'],
  ];
  return {
    title: 'Caddie',
    body:
      empty({
        iconName: 'location',
        title: 'GPS caddie',
        text: 'Your on-course distances will live here. Arrives in Phase 4.',
      }) + section('What’s planned', list(planned.map(([t, s]) => row({ title: t, subtitle: s })))),
  };
}
