// @ts-check
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// src/cli/paths.js is two levels below the package root.
const ICONS_DIR = fileURLToPath(new URL('../../icons/', import.meta.url));
const PKG_ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** @param {string} name @returns {string|null} */
export function iconSource(name) {
  const p = join(ICONS_DIR, `${name}.tsx`);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

/** @returns {string} */
export function typesSource() {
  return readFileSync(join(ICONS_DIR, 'types.ts'), 'utf8');
}

/** @param {string} name @returns {string} */
export function packageFile(name) {
  return readFileSync(join(PKG_ROOT, name), 'utf8');
}

/** @returns {string[]} */
export function listIconNames() {
  return readdirSync(ICONS_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.slice(0, -'.tsx'.length));
}
