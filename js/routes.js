// Every screen in the app and the address that opens it.
//   tab        — which tab the screen belongs to (lessons can open from any tab)
//   title      — quick title lookup, used for back-button labels on deep links
//   ancestors  — screens that sit "above" this one, used to rebuild the back stack

import home from './views/home.js';
import library from './views/library.js';
import category from './views/category.js';
import topic from './views/topic.js';
import lesson from './views/lesson.js';
import { searchView, savedView, caddieView } from './views/placeholders.js';

export const ROUTES = [
  { pattern: /^\/$/, view: home, tab: 'home', title: () => 'Home' },
  { pattern: /^\/library$/, view: library, tab: 'library', title: () => 'Library' },
  {
    pattern: /^\/library\/([\w-]+)$/,
    view: category,
    tab: 'library',
    title: ([c], content) => content.category(c)?.title,
  },
  {
    pattern: /^\/library\/([\w-]+)\/([\w-]+)$/,
    view: topic,
    tab: 'library',
    title: ([, t], content) => content.topic(t)?.node.title,
    ancestors: ([c]) => [`/library/${c}`],
  },
  {
    pattern: /^\/lesson\/([\w-]+)$/,
    view: lesson,
    title: ([id], content) => content.articles.get(id)?.title,
  },
  { pattern: /^\/search$/, view: searchView, tab: 'search', title: () => 'Search' },
  { pattern: /^\/saved$/, view: savedView, tab: 'saved', title: () => 'Saved' },
  { pattern: /^\/caddie$/, view: caddieView, tab: 'caddie', title: () => 'Caddie' },
];

export const NOT_FOUND = () => ({
  title: 'Not found',
  body: `<div class="empty"><p>This page doesn't exist.</p><a class="button" href="#/">Go home</a></div>`,
});
