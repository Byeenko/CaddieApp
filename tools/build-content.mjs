#!/usr/bin/env node
// Run after adding or editing lessons:   node tools/build-content.mjs
//
// 1. Reads every lesson in content/articles (any sub-folder) and writes content/manifest.json
// 2. Checks that topics, related lessons and [[links]] all point somewhere real
// 3. Lists every app file in precache.json and bumps the version in sw.js so phones update
//
// No packages needed — plain Node.js.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const warnings = [];
const warn = (msg) => warnings.push(msg);

function walk(dir, filter) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out.sort();
}

// --- tiny YAML front-matter reader (key: value, key: [a, b], and "- item" lists) ---
function parseFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item && listKey) {
      data[listKey].push(clean(item[1]));
      continue;
    }
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, raw] = kv;
    if (raw === '') {
      data[key] = [];
      listKey = key;
    } else if (/^\[.*\]$/.test(raw)) {
      data[key] = raw.slice(1, -1).split(',').map(clean).filter(Boolean);
      listKey = null;
    } else {
      data[key] = clean(raw);
      listKey = null;
    }
  }
  return { data, body: text.slice(m[0].length) };
}
const clean = (s) => s.trim().replace(/^["']|["']$/g, '').replace(/^\[\[|\]\]$/g, '');

function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^>\s*\[![^\]]+\]/gm, '')
    .replace(/[#>*_`|~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- library tree ---
const library = JSON.parse(readFileSync(join(ROOT, 'content/library.json'), 'utf8'));
const topicIds = new Set();
const ids = new Set();
for (const c of library.categories) {
  if (ids.has(c.id)) warn(`Duplicate id "${c.id}" in library.json`);
  ids.add(c.id);
  for (const t of c.topics || []) {
    for (const node of [t, ...(t.subtopics || [])]) {
      if (topicIds.has(node.id)) warn(`Duplicate topic id "${node.id}" in library.json`);
      topicIds.add(node.id);
    }
  }
}

// --- lessons ---
const articles = [];
for (const file of walk(join(ROOT, 'content/articles'), (p) => p.endsWith('.md'))) {
  const text = readFileSync(file, 'utf8');
  const { data, body } = parseFrontMatter(text);
  const id = data.id || basename(file, '.md');
  if (data.draft === 'true') continue;
  if (!data.title) warn(`${rel(file)}: missing "title"`);
  if (!topicIds.has(data.topic)) warn(`${rel(file)}: topic "${data.topic}" isn't in library.json`);
  const words = plainText(body).split(' ').length;
  const links = [...body.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim().split('/').pop());
  articles.push({
    id,
    title: data.title || id,
    summary: data.summary || '',
    topic: data.topic,
    level: data.level || 'beginner',
    tags: data.tags || [],
    related: data.related || [],
    order: data.order ? Number(data.order) : undefined,
    readMins: Math.max(1, Math.round(words / 200)),
    path: rel(file),
    text: plainText(body),
    _links: links,
  });
}

const articleIds = new Set(articles.map((a) => a.id));
for (const a of articles) {
  for (const r of a.related) if (!articleIds.has(r)) warn(`${a.path}: related lesson "${r}" not found`);
  for (const l of a._links) if (!articleIds.has(l)) warn(`${a.path}: [[${l}]] links to a lesson that doesn't exist yet`);
  delete a._links;
}
for (const f of library.featured || []) if (!articleIds.has(f)) warn(`library.json: featured lesson "${f}" not found`);

writeFileSync(
  join(ROOT, 'content/manifest.json'),
  JSON.stringify({ generated: new Date().toISOString(), count: articles.length, articles }, null, 1) + '\n'
);

// --- offline file list + version ---
const appFiles = [
  'index.html',
  'manifest.webmanifest',
  ...walk(join(ROOT, 'css'), () => true).map(rel),
  ...walk(join(ROOT, 'js'), (p) => p.endsWith('.js')).map(rel),
  ...walk(join(ROOT, 'icons'), (p) => p.endsWith('.png')).map(rel),
  ...walk(join(ROOT, 'content'), (p) => /\.(json|md|svg|png|jpe?g|webp)$/.test(p)).map(rel),
];
const hash = createHash('sha256');
for (const f of appFiles) if (f !== 'content/manifest.json') hash.update(f).update(readFileSync(join(ROOT, f)));
hash.update(JSON.stringify(articles.map(({ text, ...a }) => a)));
const version = hash.digest('hex').slice(0, 12);

writeFileSync(join(ROOT, 'precache.json'), JSON.stringify({ version, files: ['./', ...appFiles] }, null, 1) + '\n');
const swPath = join(ROOT, 'sw.js');
writeFileSync(swPath, readFileSync(swPath, 'utf8').replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`));

console.log(`✓ ${articles.length} lessons · ${appFiles.length} files cached offline · version ${version}`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log('  • ' + w);
}
