// @ts-check
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { assertInsideProject, ensureFile } from './fs-safe.js';
import { iconSource, typesSource, listIconNames } from './paths.js';
import { transformIcon, transformTypes, contentWithoutHeader } from './transform.js';
import { classifyName } from './names.js';
import { ioniconsLicenseText, TRADEMARKS_TEXT } from './notices.js';
import { ensureBarrel } from './barrel.js';

/**
 * @param {{names: string[], dir: string, cwd: string, overwrite?: boolean, allowOutside?: boolean, barrel?: boolean}} opts
 */
export function addIcons({ names, dir, cwd, overwrite = false, allowOutside = false, barrel = true }) {
  const realDir = assertInsideProject(cwd, dir, { allowOutside });

  const known = new Set(listIconNames());
  const classified = names.map((n) => classifyName(n, known));

  const unsafe = classified.filter((c) => c.kind === 'unsafe');
  if (unsafe.length) {
    throw new Error(`Unsafe icon name(s): ${unsafe.map((c) => JSON.stringify(c.raw)).join(', ')}`);
  }
  const ok = /** @type {{kind:'ok',raw:string,name:string}[]} */ (classified.filter((c) => c.kind === 'ok'));
  const unknown = classified.filter((c) => c.kind === 'unknown').map((c) => c.raw);
  const hasLogo = ok.some((c) => c.name.startsWith('logo-'));

  /** @type {Array<[string, string]>} */
  const shared = [];
  /** @type {Array<{name: string, status: string, isLogo: boolean}>} */
  const results = [];
  /** @type {{status: string, count: number}|undefined} */
  let barrelResult;

  if (ok.length > 0) {
    mkdirSync(realDir, { recursive: true });

    shared.push([
      'icon.types.ts',
      ensureFile(join(realDir, 'icon.types.ts'), transformTypes(typesSource()), {
        overwrite,
        compare: contentWithoutHeader,
      }),
    ]);
    shared.push(['IONICONS-LICENSE', ensureFile(join(realDir, 'IONICONS-LICENSE'), ioniconsLicenseText(), { overwrite })]);
    if (hasLogo) {
      shared.push(['TRADEMARKS.md', ensureFile(join(realDir, 'TRADEMARKS.md'), TRADEMARKS_TEXT, { overwrite })]);
    }

    for (const c of ok) {
      const src = /** @type {string} */ (iconSource(c.name));
      const isLogo = c.name.startsWith('logo-');
      const isOriginal = c.name === 'spinner';
      const out = transformIcon(src, { name: c.name, isLogo, isOriginal });
      const status = ensureFile(join(realDir, `${c.name}.tsx`), out, {
        overwrite,
        compare: contentWithoutHeader,
      });
      results.push({ name: c.name, status, isLogo });
    }

    if (barrel) {
      barrelResult = ensureBarrel(realDir);
    }
  }

  return { dir: realDir, results, unknown, shared, hasLogo, barrel: barrelResult };
}
