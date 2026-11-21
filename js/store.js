// Local data on the phone: settings, reading history, and (Phase 2) bookmarks.
// Everything goes through this module, so the storage can move to IndexedDB later
// (e.g. for shot tracking) without touching the screens.

const NS = 'caddie:';
const SCHEMA = 1;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — the app keeps working without saving */
  }
}

export const store = {
  get: read,
  set: write,

  recent() {
    return read('recent', []);
  },
  addRecent(id) {
    const list = read('recent', []).filter((x) => x !== id);
    list.unshift(id);
    write('recent', list.slice(0, 20));
  },
};

export async function initStore() {
  if (read('schema', 0) !== SCHEMA) write('schema', SCHEMA);
  // Ask iOS to keep our data even when the phone is low on space.
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    /* not supported — fine */
  }
}
