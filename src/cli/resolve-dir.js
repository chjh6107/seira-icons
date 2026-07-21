// @ts-check
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} cwd @returns {string} */
export function detectDefaultDir(cwd) {
  return existsSync(join(cwd, 'src')) ? 'src/components/icons' : 'components/icons';
}

/**
 * @param {{flagDir?: string, cwd: string, config: {directory: string}|null}} opts
 * @returns {{dir: string, persist: boolean, source: 'flag'|'config'|'detected'}}
 */
export function resolveTargetDir({ flagDir, cwd, config }) {
  if (flagDir) return { dir: flagDir, persist: config === null, source: 'flag' };
  if (config) return { dir: config.directory, persist: false, source: 'config' };
  return { dir: detectDefaultDir(cwd), persist: true, source: 'detected' };
}
