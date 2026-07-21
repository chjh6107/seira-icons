// @ts-check
import {
  openSync, writeSync, closeSync, readFileSync, lstatSync, realpathSync, existsSync, constants,
} from 'node:fs';
import { resolve, relative, dirname, sep, basename } from 'node:path';

/**
 * realpath the longest existing prefix of `p`, then re-append the missing tail.
 * @param {string} p
 * @returns {string}
 */
function realpathAllowingMissing(p) {
  let current = resolve(p);
  const tail = [];
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) break;
    tail.unshift(basename(current));
    current = parent;
  }
  const realBase = realpathSync(current);
  return tail.length ? resolve(realBase, ...tail) : realBase;
}

/**
 * @param {string} cwd
 * @param {string} targetDir
 * @param {{allowOutside?: boolean}} [opts]
 * @returns {string} realpath-resolved absolute target dir
 */
export function assertInsideProject(cwd, targetDir, { allowOutside = false } = {}) {
  const realCwd = realpathSync(resolve(cwd));
  const realTarget = realpathAllowingMissing(resolve(cwd, targetDir));
  const rel = relative(realCwd, realTarget);
  const escapes = rel === '..' || rel.startsWith(`..${sep}`);
  if (escapes && !allowOutside) {
    throw new Error(
      `Refusing to write outside the project: ${realTarget}\nPass --allow-outside to override.`,
    );
  }
  return realTarget;
}

/**
 * @param {string} filePath
 * @param {string} content
 * @param {{overwrite?: boolean, compare?: (s: string) => string, allowOverwrite?: (existing: string) => boolean}} [opts]
 * @returns {'written'|'skipped-identical'|'conflict'}
 */
export function ensureFile(filePath, content, { overwrite = false, compare, allowOverwrite } = {}) {
  /** @type {string|null} */
  let existing = null;
  try {
    const st = lstatSync(filePath);
    if (st.isSymbolicLink()) {
      throw new Error(`Refusing to write through a symlink: ${filePath}`);
    }
    existing = readFileSync(filePath, 'utf8');
  } catch (err) {
    if (/** @type {NodeJS.ErrnoException} */ (err).code !== 'ENOENT') throw err;
  }

  if (existing !== null) {
    const a = compare ? compare(existing) : existing;
    const b = compare ? compare(content) : content;
    if (a === b) return 'skipped-identical';
    const mayOverwrite = allowOverwrite ? allowOverwrite(existing) : overwrite;
    if (!mayOverwrite) return 'conflict';
    const fd = openSync(filePath, constants.O_WRONLY | constants.O_TRUNC | constants.O_NOFOLLOW);
    try { writeSync(fd, content); } finally { closeSync(fd); }
    return 'written';
  }

  const fd = openSync(
    filePath,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o644,
  );
  try { writeSync(fd, content); } finally { closeSync(fd); }
  return 'written';
}
