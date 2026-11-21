// App-wide settings. Change these here rather than hunting through the code.
export const CONFIG = {
  appName: 'Caddie',
  version: '0.3.0',      // bump on every release; shown at the bottom of Home
  units: 'yards',        // 'yards' | 'metres' — used by the GPS caddie (Phase 4)
  handedness: 'right',   // lessons are written for right-handed golfers
};

// The five tabs along the bottom of the screen. `root` is the screen each tab opens to.
export const TABS = [
  { id: 'home',    label: 'Home',    icon: 'home',     root: '/' },
  { id: 'library', label: 'Library', icon: 'library',  root: '/library' },
  { id: 'search',  label: 'Search',  icon: 'search',   root: '/search' },
  { id: 'saved',   label: 'Saved',   icon: 'bookmark', root: '/saved' },
  { id: 'caddie',  label: 'Caddie',  icon: 'flag',     root: '/caddie' },
];
