// @ts-check
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const CONFIG_NAME = 'seira-icons.json';

/** @param {string} cwd @returns {{directory: string, barrel?: boolean}|null} */
export function readConfig(cwd) {
  let raw;
  try {
    raw = readFileSync(join(cwd, CONFIG_NAME), 'utf8');
  } catch (err) {
    if (/** @type {NodeJS.ErrnoException} */ (err).code === 'ENOENT') return null;
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    process.stderr.write(`Warning: ${CONFIG_NAME} is not valid JSON; ignoring it.\n`);
    return null;
  }
  // No deep-merge: read the one field directly with a type guard.
  if (parsed && typeof parsed.directory === 'string' && parsed.directory.length > 0) {
    /** @type {{directory: string, barrel?: boolean}} */
    const cfg = { directory: parsed.directory };
    if (typeof parsed.barrel === 'boolean') cfg.barrel = parsed.barrel;
    return cfg;
  }
  process.stderr.write(`Warning: ${CONFIG_NAME} has no valid "directory"; ignoring it.\n`);
  return null;
}

/** @param {string} cwd @param {{directory: string, barrel?: boolean}} cfg */
export function writeConfig(cwd, { directory, barrel }) {
  /** @type {{version: number, directory: string, barrel?: boolean}} */
  const obj = { version: 1, directory };
  if (typeof barrel === 'boolean') obj.barrel = barrel;
  const body = `${JSON.stringify(obj, null, 2)}\n`;
  writeFileSync(join(cwd, CONFIG_NAME), body);
}
