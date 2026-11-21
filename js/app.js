// App start-up and navigation.
//
// Navigation works like a native iPhone app: each tab keeps its own stack of screens.
// Tapping a link pushes a screen, the back button pops it, and tapping the current
// tab returns to that tab's first screen. The address bar hash mirrors the current
// screen so a reload (or a shared link) opens the same place.

import { CONFIG, TABS } from './config.js';
import { loadContent } from './content.js';
import { store, initStore } from './store.js';
import { icon } from './icons.js';
import { esc } from './util.js';
import { ROUTES, NOT_FOUND } from './routes.js';

const view = document.getElementById('view');
const tabbar = document.getElementById('tabbar');

const stacks = Object.fromEntries(TABS.map((t) => [t.id, [t.root]]));
const scrollMemory = new Map();
const titleMemory = new Map();
let currentTab = 'home';
let content = null;
let renderToken = 0;

function match(path) {
  for (const r of ROUTES) {
    const m = r.pattern.exec(path);
    if (m) return { route: r, params: m.slice(1).map(decodeURIComponent) };
  }
  return null;
}

const tabForRoot = (path) => TABS.find((t) => t.root === path);
const top = () => stacks[currentTab][stacks[currentTab].length - 1];

// ---------- navigation actions ----------

function push(path) {
  const rootTab = tabForRoot(path);
  if (rootTab) return switchTab(rootTab.id);
  if (path === top()) return;
  scrollMemory.set(top(), window.scrollY);
  stacks[currentTab].push(path);
  show('forward');
}

function back() {
  const stack = stacks[currentTab];
  if (stack.length <= 1) return;
  scrollMemory.delete(stack.pop());
  show('back');
}

function switchTab(tabId) {
  if (tabId === currentTab) {
    const stack = stacks[tabId];
    if (stack.length > 1) {
      stack.splice(1).forEach((p) => scrollMemory.delete(p));
      show('back');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  scrollMemory.set(top(), window.scrollY);
  currentTab = tabId;
  show('none');
}

/** Rebuilds a sensible stack when the app opens on a deep link (e.g. after a reload). */
function stackFor(path) {
  const m = match(path);
  if (!m) return { tab: 'home', stack: ['/'] };
  if (m.route.tab) {
    const root = TABS.find((t) => t.id === m.route.tab).root;
    const stack = [root];
    if (m.route.ancestors) stack.push(...m.route.ancestors(m.params, content));
    if (path !== root) stack.push(path);
    return { tab: m.route.tab, stack };
  }
  // A lesson: open it inside the Library, under its topic.
  const a = content.articles.get(m.params[0]);
  const place = a && content.placeOf(a);
  const stack = ['/library'];
  if (place?.category) {
    stack.push(`/library/${place.category.id}`, content.topicPath(place.category.id, place.topic.id));
  }
  stack.push(path);
  return { tab: 'library', stack };
}

// ---------- rendering ----------

async function show(direction) {
  const token = ++renderToken;
  const path = top();
  history.replaceState(null, '', '#' + path);
  renderTabbar();

  const m = match(path);
  const stack = stacks[currentTab];
  const prevPath = stack.length > 1 ? stack[stack.length - 2] : null;

  let result;
  try {
    const ctx = { params: m ? m.params : [], path, content, store, push, back, config: CONFIG };
    result = await (m ? m.route.view(ctx) : NOT_FOUND(ctx));
  } catch (err) {
    console.error(err);
    result = {
      title: 'Something went wrong',
      body: `<div class="empty"><p>${esc(err.message)}</p></div>`,
    };
  }
  if (token !== renderToken) return; // the user moved on while this was loading

  titleMemory.set(path, result.title);
  const page = buildPage(result, prevPath);
  view.replaceChildren(page);
  document.title = result.title ? `${result.title} · ${CONFIG.appName}` : CONFIG.appName;

  const y = direction === 'forward' ? 0 : scrollMemory.get(path) || 0;
  window.scrollTo(0, y);
  if (direction !== 'none') page.classList.add(`enter-${direction}`);

  observeLargeTitle(page);
  result.mount?.(page);
}

function buildPage(result, prevPath) {
  const page = document.createElement('div');
  page.className = 'page';
  const backLabel = prevPath ? titleMemory.get(prevPath) || 'Back' : null;
  const largeTitle = result.largeTitle !== false;

  page.innerHTML = `
    <header class="navbar">
      <div class="navbar-inner">
        <div class="navbar-side">
          ${backLabel ? `<button class="back-btn" type="button" data-back>${icon('chevronLeft')}<span>${esc(shorten(backLabel))}</span></button>` : ''}
        </div>
        <div class="navbar-title">${esc(result.title || '')}</div>
        <div class="navbar-side navbar-actions">${result.actions || ''}</div>
      </div>
    </header>
    <div class="page-content">
      ${largeTitle ? `
        <div class="large-title-block" data-large-title>
          ${result.eyebrow ? `<div class="eyebrow">${result.eyebrow}</div>` : ''}
          <h1 class="large-title">${esc(result.title)}</h1>
        </div>` : ''}
      ${result.body || ''}
    </div>`;

  page.querySelector('[data-back]')?.addEventListener('click', back);
  return page;
}

function shorten(label) {
  return label.length > 14 ? label.slice(0, 13).trimEnd() + '…' : label;
}

let titleObserver;
function observeLargeTitle(page) {
  titleObserver?.disconnect();
  const navbar = page.querySelector('.navbar');
  const target = page.querySelector('[data-large-title]');
  if (!target) return navbar.classList.add('scrolled');
  titleObserver = new IntersectionObserver(
    ([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px`, threshold: 0 }
  );
  titleObserver.observe(target.querySelector('.large-title') || target);
}

function renderTabbar() {
  tabbar.innerHTML = `<div class="tabbar-inner">${TABS.map(
    (t) => `
    <button type="button" class="tab ${t.id === currentTab ? 'active' : ''}" data-tab="${t.id}"
      aria-current="${t.id === currentTab ? 'page' : 'false'}">
      ${icon(t.icon)}<span>${t.label}</span>
    </button>`
  ).join('')}</div>`;
}

tabbar.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-tab]');
  if (btn) switchTab(btn.dataset.tab);
});

// In-app links (<a href="#/...">) push onto the current tab instead of reloading.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#/"]');
  if (!a || e.defaultPrevented) return;
  e.preventDefault();
  push(a.getAttribute('href').slice(1));
});

// ---------- start ----------

async function start() {
  await initStore();
  try {
    content = await loadContent();
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="page"><div class="page-content"><div class="empty">
      <h2>Couldn't load the library</h2><p>${esc(err.message)}</p></div></div></div>`;
    return;
  }
  openFromHash();
  // Someone edited the address or followed an outside link: jump straight there.
  window.addEventListener('hashchange', () => {
    if (decodeURIComponent(location.hash.slice(1)) !== top()) openFromHash();
  });
}

function openFromHash() {
  const target = decodeURIComponent(location.hash.slice(1)) || '/';
  const { tab, stack } = stackFor(target);
  currentTab = tab;
  stacks[tab] = stack;
  // Pre-fill back-button labels for a rebuilt stack.
  for (const p of stack) {
    const m = match(p);
    if (m?.route.title) titleMemory.set(p, m.route.title(m.params, content));
  }
  show('none');
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Offline cache unavailable', err));
}

start();
