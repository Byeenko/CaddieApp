// Line icons drawn on a 24×24 grid. Stroke colour follows the surrounding text colour.
const P = {
  home: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v10.5a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9"/>',
  library: '<path d="M3.5 5.5c2.8-1.3 5.6-1.3 8.5.5v14c-2.9-1.8-5.7-1.8-8.5-.5z"/><path d="M20.5 5.5c-2.8-1.3-5.6-1.3-8.5.5v14c2.9-1.8 5.7-1.8 8.5-.5z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  bookmark: '<path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.5-6.5 4.5v-16a1 1 0 0 1 1-1z"/>',
  flag: '<path d="M7 21V3.5"/><path d="M7 4h11l-2.8 3.75L18 11.5H7"/><path d="M3.5 21h7"/>',
  chevronLeft: '<path d="M15 4.5 7.5 12l7.5 7.5"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  location: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.75v.01"/>',
  // Category icons
  fundamentals: '<path d="M8 20.5V3.5"/><path d="M8 4h10l-2.6 3.5L18 11H8"/><ellipse cx="8" cy="20.5" rx="4.5" ry="1"/>',
  swing: '<path d="M4 19.5C5.5 11 11 5.5 20 4.5"/><path d="M16.5 3.5 20 4.5l-1.5 3.3"/><circle cx="5.5" cy="19.5" r="1.6"/>',
  driving: '<circle cx="12" cy="7.5" r="4"/><path d="M8.5 13.5h7l-2 1.5v6h-3v-6z"/>',
  irons: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6"/>',
  shortgame: '<path d="M3.5 17.5c3-7.5 8.5-9 12.5-3.5"/><circle cx="18.5" cy="16" r="1.8"/><path d="M2.5 20.5h19"/>',
  putting: '<ellipse cx="15" cy="18" rx="5.5" ry="2"/><path d="M15 18V4.5l4.5 2-4.5 2"/><circle cx="5.5" cy="16.5" r="1.8"/>',
  strategy: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
  clubs: '<rect x="6.5" y="9" width="11" height="12" rx="2.5"/><path d="M9.5 9V3.5M12 9V2.5M14.5 9V4.5"/>',
  shaping: '<path d="M5 20.5c0-5.5 4-7.5 7-9s6-3.5 6-7.5"/><circle cx="5" cy="20.5" r="1.6"/><path d="M15.5 4.5 18 4l.6 2.6"/>',
  equipment: '<path d="M4 7h9M17 7h3M4 17h4M12 17h8"/><circle cx="15" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  practice: '<path d="M4.5 11.5a7.5 7.5 0 0 1 13-4.5l1.5 1.5"/><path d="M19.5 4v4.5H15"/><path d="M19.5 12.5a7.5 7.5 0 0 1-13 4.5L5 15.5"/><path d="M4.5 20v-4.5H9"/>',
  mental: '<path d="M12 3.5a6 6 0 0 0-3.6 10.8V17h7.2v-2.7A6 6 0 0 0 12 3.5z"/><path d="M9.5 20.5h5"/>',
  lies: '<path d="M2.5 19.5 21.5 9v10.5z"/><circle cx="11" cy="11.6" r="1.9"/>',
  oncourse: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
  fitness: '<path d="M3.5 12h17"/><path d="M6 8.5v7M18 8.5v7"/><path d="M3.5 10v4M20.5 10v4"/>',
  advanced: '<path d="M3.5 20.5h17"/><path d="M7 17v-5M12 17V6.5M17 17v-8"/>',
};

export function icon(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[name] || P.info}</svg>`;
}
