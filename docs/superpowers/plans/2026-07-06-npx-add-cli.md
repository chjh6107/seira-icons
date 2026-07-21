# npx `add` copy-in CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a zero-dependency `npx @seira-icons/ionicons add <names...>` command that copies only the requested icon `.tsx` files (plus a shared type + license/trademark notices) into a user's project.

**Architecture:** Pure-function ESM modules under `src/cli/` (path resolution, transform, config, safe FS, name classification) orchestrated by `src/cli/add.js`, with `bin/cli.js` as the thin argv/output shell. Icon sources are read from the package's own `icons/` dir via `import.meta.url`. No runtime dependencies — only `node:` builtins.

**Tech Stack:** Node.js ESM (`type: module`), `node:util` parseArgs, `node:fs`, vitest, TypeScript (`checkJs` for the `.js` CLI, `tsc --noEmit` for a copied-output compile test).

**Spec:** `docs/superpowers/specs/2026-07-06-npx-add-cli-design.md`

## Global Constraints

- Node floor: `>=18.3.0` (declared in `engines`; `util.parseArgs` minimum).
- Runtime dependencies: **zero** — only `node:*` builtins in `bin/` and `src/cli/`.
- Module system: ESM. `package.json` must have `"type": "module"`. All intra-CLI imports use explicit `.js` extensions.
- CLI language: `.js` with `// @ts-check` + JSDoc; typechecked via `tsconfig.cli.json`.
- Icon identifier: kebab filename (`heart-outline`); filled variant = bare name (`heart`).
- Import rewrite: `from './types'` → `from './icon.types'`, and the transform MUST assert exactly one occurrence (throw otherwise).
- Header injection: `header + '\n' + source`.
- Icon SPDX header (non-logo), exact base string:
  `/*! SPDX-License-Identifier: MIT | @license Ionicons (c) 2015-present Ionic (https://ionic.io) — ported by @seira-icons/ionicons. Full license: ./IONICONS-LICENSE */`
- Shared files (ensure-once, write-if-absent / skip-if-identical / `--overwrite`): `icon.types.ts`, `IONICONS-LICENSE` always; `TRADEMARKS.md` only when a `logo-*` icon is in the batch.
- Security: confine the resolved target dir within `realpath(cwd)` unless `--allow-outside`; write final files with `O_CREAT|O_EXCL|O_NOFOLLOW` (and reject existing symlinks); validate the config `directory` on every read; never deep-merge parsed config.
- Path default: `src/` exists → `src/components/icons`, else `components/icons`.
- Config `seira-icons.json`: `{ "version": 1, "directory": string }`; persist only on first run when no config exists; `--dir` with an existing config is a per-run override (no write-back).
- Overwrite: skip by default (exit 0), `--overwrite` forces; skip-equality compares with the SPDX/license header stripped.
- Unknown name → fuzzy suggestions, process exits 1.
- Package wiring: `bin: { "ionicons": "bin/cli.js" }`, `files: ["bin","src","icons","THIRD_PARTY_LICENSES"]`, `publishConfig.access: "public"`, `.gitattributes` pins `bin/** eol=lf`.

---

### Task 1: Project scaffolding (ESM + CLI typecheck/test wiring)

Establishes ESM, the CLI typecheck config, vitest collection of CLI tests, and the LF pin. Every later task depends on this.

**Files:**
- Modify: `package.json` (add `type`, `bin`, `files`, `engines`, `publishConfig`, scripts, `@types/node` devDep)
- Create: `tsconfig.cli.json`
- Modify: `vitest.config.ts`
- Create: `.gitattributes`
- Create: `test/cli/scaffold.test.ts` (temporary liveness test)

**Interfaces:**
- Produces: `npm run typecheck:cli` and vitest collection of `test/cli/**`.

- [ ] **Step 1: Write the failing test**

Create `test/cli/scaffold.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('cli scaffolding', () => {
  it('collects tests under test/cli', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 2: Run it to verify it is NOT yet collected**

Run: `npx vitest run test/cli`
Expected: FAIL / "No test files found" (vitest `include` is still `test/**/*.test.{ts,tsx}` — it actually matches, so if it already passes, that's fine; the real change below is the config wiring). Proceed regardless.

- [ ] **Step 3: Wire package.json**

Edit `package.json` to this shape (keep existing `description`, `license`, `peerDependencies`):
```json
{
  "name": "@seira-icons/ionicons",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Unofficial React components ported from the Ionicons icon set (MIT). Not affiliated with Ionic.",
  "license": "MIT",
  "bin": { "ionicons": "bin/cli.js" },
  "files": ["bin", "src", "icons", "THIRD_PARTY_LICENSES"],
  "engines": { "node": ">=18.3.0" },
  "publishConfig": { "access": "public" },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typecheck:cli": "tsc --noEmit -p tsconfig.cli.json",
    "test": "vitest run"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.2.3",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "typescript": "^5.7.0",
    "vitest": "^4.1.9"
  },
  "peerDependencies": { "react": ">=18" }
}
```

- [ ] **Step 4: Create `tsconfig.cli.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["bin/**/*.js", "src/cli/**/*.js", "test/cli/**/*.ts"]
}
```

- [ ] **Step 5: Widen vitest collection and pin LF**

Edit `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.{ts,tsx}'],
  },
});
```
(Already matches `test/cli/**` — no change needed unless it differs. Leave as-is.)

Create `.gitattributes`:
```
bin/** text eol=lf
```

- [ ] **Step 6: Install and verify**

Run: `npm install`
Run: `npx vitest run test/cli`
Expected: PASS (1 test).
Run: `npm run typecheck:cli`
Expected: PASS (no `.js` files yet; config is valid).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.cli.json vitest.config.ts .gitattributes test/cli/scaffold.test.ts
git commit -m "chore: scaffold ESM + CLI typecheck/test wiring"
```

---

### Task 2: `paths.js` — resolve the package's own icons/

**Files:**
- Create: `src/cli/paths.js`
- Test: `test/cli/paths.test.ts`

**Interfaces:**
- Produces:
  - `iconSource(name: string): string | null` — icon `.tsx` text, or null if absent
  - `typesSource(): string` — text of `icons/types.ts`
  - `packageFile(name: string): string` — text of a package-root file (e.g. `THIRD_PARTY_LICENSES`)
  - `listIconNames(): string[]` — basenames (no `.tsx`) of all icons

- [ ] **Step 1: Write the failing test**

`test/cli/paths.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { iconSource, typesSource, packageFile, listIconNames } from '../../src/cli/paths.js';

describe('paths', () => {
  it('reads a known icon source', () => {
    const src = iconSource('heart');
    expect(src).toContain("from './types'");
    expect(src).toContain('const Heart');
  });
  it('returns null for an unknown icon', () => {
    expect(iconSource('definitely-not-an-icon')).toBeNull();
  });
  it('reads the shared types source', () => {
    expect(typesSource()).toContain('IconProps');
  });
  it('reads a package-root file', () => {
    expect(packageFile('THIRD_PARTY_LICENSES')).toContain('The MIT License');
  });
  it('lists icon names without extension and excludes types', () => {
    const names = listIconNames();
    expect(names).toContain('heart');
    expect(names).not.toContain('types');
    expect(names.length).toBeGreaterThan(1000);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/paths.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/paths.js'".

- [ ] **Step 3: Implement `src/cli/paths.js`**

```js
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
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/paths.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/paths.js test/cli/paths.test.ts
git commit -m "feat(cli): add paths module for resolving package icons"
```

---

### Task 3: `notices.js` — license/trademark text + SPDX headers

**Files:**
- Create: `src/cli/notices.js`
- Test: `test/cli/notices.test.ts`

**Interfaces:**
- Consumes: `packageFile` (Task 2).
- Produces:
  - `iconHeader({ isLogo?: boolean }): string` — block comment, no trailing newline
  - `typesHeader(): string`
  - `ioniconsLicenseText(): string` — full MIT text (from `THIRD_PARTY_LICENSES`)
  - `TRADEMARKS_TEXT: string`

- [ ] **Step 1: Write the failing test**

`test/cli/notices.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { iconHeader, typesHeader, ioniconsLicenseText, TRADEMARKS_TEXT } from '../../src/cli/notices.js';

describe('notices', () => {
  it('non-logo header is a single-line SPDX block comment', () => {
    const h = iconHeader({ isLogo: false });
    expect(h.startsWith('/*!')).toBe(true);
    expect(h.endsWith('*/')).toBe(true);
    expect(h).toContain('SPDX-License-Identifier: MIT');
    expect(h).toContain('./IONICONS-LICENSE');
    expect(h).not.toContain('\n');
  });
  it('logo header adds a trademark line referencing TRADEMARKS.md', () => {
    const h = iconHeader({ isLogo: true });
    expect(h).toContain('Trademark');
    expect(h).toContain('./TRADEMARKS.md');
    expect(h).toContain('\n');
  });
  it('types header is our own MIT one-liner', () => {
    expect(typesHeader()).toContain('seira-icons');
  });
  it('ioniconsLicenseText carries the MIT permission notice', () => {
    const t = ioniconsLicenseText();
    expect(t).toContain('Permission is hereby granted');
    expect(t).toContain('THE SOFTWARE IS PROVIDED "AS IS"');
  });
  it('trademarks text has a removal channel', () => {
    expect(TRADEMARKS_TEXT.toLowerCase()).toContain('removal');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/notices.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/notices.js'".

- [ ] **Step 3: Implement `src/cli/notices.js`**

```js
// @ts-check
import { packageFile } from './paths.js';

const BASE =
  '/*! SPDX-License-Identifier: MIT | @license Ionicons (c) 2015-present Ionic (https://ionic.io) — ' +
  'ported by @seira-icons/ionicons. Full license: ./IONICONS-LICENSE';

/** @param {{isLogo?: boolean}} [opts] @returns {string} */
export function iconHeader({ isLogo = false } = {}) {
  if (!isLogo) return `${BASE} */`;
  return (
    `${BASE}\n` +
    ' * Trademark: brand logos are trademarks of their respective owners. MIT covers the SVG ' +
    'artwork, not the mark. See ./TRADEMARKS.md */'
  );
}

/** @returns {string} */
export function typesHeader() {
  return '/*! SPDX-License-Identifier: MIT | (c) 2026 seira-icons — @seira-icons/ionicons */';
}

/** @returns {string} — single source: the package's shipped THIRD_PARTY_LICENSES */
export function ioniconsLicenseText() {
  return packageFile('THIRD_PARTY_LICENSES');
}

export const TRADEMARKS_TEXT = `# Trademarks

This directory may include brand logo icons (\`logo-*\`) derived from Ionicons.

- Each brand name and logo is a trademark of its respective owner.
- The MIT license covers the SVG **artwork**, not the trademark. No trademark
  rights are granted.
- Inclusion does not imply affiliation with or endorsement by any brand.
- You are responsible for following each brand's usage guidelines.

## Removal requests

Brand owners who want a logo removed: open an issue labeled
\`trademark-removal\`, or email <the project issue tracker>.
`;
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/notices.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/notices.js test/cli/notices.test.ts
git commit -m "feat(cli): add license/trademark notices module"
```

---

### Task 4: `transform.js` — header injection + guarded import rewrite

**Files:**
- Create: `src/cli/transform.js`
- Test: `test/cli/transform.test.ts`

**Interfaces:**
- Consumes: `iconHeader`, `typesHeader` (Task 3).
- Produces:
  - `transformIcon(source: string, { name: string, isLogo?: boolean }): string`
  - `transformTypes(source: string): string`
  - `contentWithoutHeader(text: string): string` — strips a leading `/*! ... */` block for skip-equality

- [ ] **Step 1: Write the failing test**

`test/cli/transform.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { transformIcon, transformTypes, contentWithoutHeader } from '../../src/cli/transform.js';

const ICON = `import type { IconProps } from './types';\nconst Heart = () => null;\nexport default Heart;\n`;

describe('transformIcon', () => {
  it('rewrites the shared-type import and prepends a header', () => {
    const out = transformIcon(ICON, { name: 'heart' });
    expect(out).toContain("from './icon.types'");
    expect(out).not.toContain("from './types'");
    expect(out.startsWith('/*!')).toBe(true);
    expect(out.split('\n')[1]).toContain('import type');
  });
  it('adds a trademark line for logos', () => {
    const out = transformIcon(ICON, { name: 'logo-github', isLogo: true });
    expect(out).toContain('./TRADEMARKS.md');
  });
  it('throws if the import is missing (future drift guard)', () => {
    expect(() => transformIcon(`const X = () => null;`, { name: 'x' })).toThrow();
  });
  it('throws if the import appears twice', () => {
    expect(() => transformIcon(ICON + ICON, { name: 'dup' })).toThrow();
  });
});

describe('transformTypes', () => {
  it('prepends our own header', () => {
    expect(transformTypes('export type IconProps = {};').startsWith('/*!')).toBe(true);
  });
});

describe('contentWithoutHeader', () => {
  it('strips a leading block comment so header changes do not flip skips', () => {
    const a = contentWithoutHeader(`/*! OLD */\nbody`);
    const b = contentWithoutHeader(`/*! NEW header text */\nbody`);
    expect(a).toBe(b);
    expect(a).toBe('body');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/transform.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/transform.js'".

- [ ] **Step 3: Implement `src/cli/transform.js`**

```js
// @ts-check
import { iconHeader, typesHeader } from './notices.js';

const NEEDLE = "from './types'";
const REPLACEMENT = "from './icon.types'";

/**
 * @param {string} source
 * @param {{name: string, isLogo?: boolean}} opts
 * @returns {string}
 */
export function transformIcon(source, { name, isLogo = false }) {
  const count = source.split(NEEDLE).length - 1;
  if (count !== 1) {
    throw new Error(
      `transformIcon(${name}): expected exactly one \`${NEEDLE}\`, found ${count}. ` +
        'Icon source shape changed; update the transform.',
    );
  }
  const rewritten = source.replace(NEEDLE, REPLACEMENT);
  return `${iconHeader({ isLogo })}\n${rewritten}`;
}

/** @param {string} source @returns {string} */
export function transformTypes(source) {
  return `${typesHeader()}\n${source}`;
}

/** @param {string} text @returns {string} */
export function contentWithoutHeader(text) {
  return text.replace(/^\/\*![\s\S]*?\*\/\n?/, '');
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/transform.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/transform.js test/cli/transform.test.ts
git commit -m "feat(cli): add transform with guarded import rewrite"
```

---

### Task 5: `config.js` — validated read/write of seira-icons.json

**Files:**
- Create: `src/cli/config.js`
- Test: `test/cli/config.test.ts`

**Interfaces:**
- Produces:
  - `readConfig(cwd: string): { directory: string } | null`
  - `writeConfig(cwd: string, cfg: { directory: string }): void`
  - `CONFIG_NAME: string`

- [ ] **Step 1: Write the failing test**

`test/cli/config.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readConfig, writeConfig, CONFIG_NAME } from '../../src/cli/config.js';

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'seira-cfg-')); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

describe('config', () => {
  it('returns null when no config exists', () => {
    expect(readConfig(dir)).toBeNull();
  });
  it('round-trips a written config', () => {
    writeConfig(dir, { directory: 'src/components/icons' });
    expect(readConfig(dir)).toEqual({ directory: 'src/components/icons' });
    expect(readFileSync(join(dir, CONFIG_NAME), 'utf8')).toContain('"version": 1');
  });
  it('falls back to null on broken JSON', () => {
    writeFileSync(join(dir, CONFIG_NAME), '{ not json');
    expect(readConfig(dir)).toBeNull();
  });
  it('falls back to null when directory is not a string', () => {
    writeFileSync(join(dir, CONFIG_NAME), JSON.stringify({ directory: 42 }));
    expect(readConfig(dir)).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/config.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/config.js'".

- [ ] **Step 3: Implement `src/cli/config.js`**

```js
// @ts-check
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const CONFIG_NAME = 'seira-icons.json';

/** @param {string} cwd @returns {{directory: string}|null} */
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
    return { directory: parsed.directory };
  }
  process.stderr.write(`Warning: ${CONFIG_NAME} has no valid "directory"; ignoring it.\n`);
  return null;
}

/** @param {string} cwd @param {{directory: string}} cfg */
export function writeConfig(cwd, { directory }) {
  const body = `${JSON.stringify({ version: 1, directory }, null, 2)}\n`;
  writeFileSync(join(cwd, CONFIG_NAME), body);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/config.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/config.js test/cli/config.test.ts
git commit -m "feat(cli): add validated config read/write"
```

---

### Task 6: `fs-safe.js` — project confinement + no-follow ensure-file

**Files:**
- Create: `src/cli/fs-safe.js`
- Test: `test/cli/fs-safe.test.ts`

**Interfaces:**
- Produces:
  - `assertInsideProject(cwd: string, targetDir: string, opts?: { allowOutside?: boolean }): string` — returns the realpath-resolved absolute dir, throws if it escapes
  - `ensureFile(filePath: string, content: string, opts?: { overwrite?: boolean, compare?: (s: string) => string }): 'written' | 'skipped-identical' | 'conflict'`

- [ ] **Step 1: Write the failing test**

`test/cli/fs-safe.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, symlinkSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assertInsideProject, ensureFile } from '../../src/cli/fs-safe.js';

let root: string;
beforeEach(() => { root = mkdtempSync(join(tmpdir(), 'seira-fs-')); });
afterEach(() => { rmSync(root, { recursive: true, force: true }); });

describe('assertInsideProject', () => {
  it('accepts a subdirectory (even if not yet created)', () => {
    const out = assertInsideProject(root, 'src/components/icons');
    expect(out).toContain('components');
  });
  it('rejects a path that escapes the project', () => {
    expect(() => assertInsideProject(root, '../../etc')).toThrow(/outside the project/);
  });
  it('allows escape with allowOutside', () => {
    expect(() => assertInsideProject(root, '../sibling', { allowOutside: true })).not.toThrow();
  });
});

describe('ensureFile', () => {
  it('writes a new file', () => {
    const p = join(root, 'a.txt');
    expect(ensureFile(p, 'hello')).toBe('written');
    expect(readFileSync(p, 'utf8')).toBe('hello');
  });
  it('skips when content is identical', () => {
    const p = join(root, 'b.txt');
    ensureFile(p, 'x');
    expect(ensureFile(p, 'x')).toBe('skipped-identical');
  });
  it('reports conflict when content differs and not overwriting', () => {
    const p = join(root, 'c.txt');
    ensureFile(p, 'one');
    expect(ensureFile(p, 'two')).toBe('conflict');
    expect(readFileSync(p, 'utf8')).toBe('one');
  });
  it('overwrites when asked', () => {
    const p = join(root, 'd.txt');
    ensureFile(p, 'one');
    expect(ensureFile(p, 'two', { overwrite: true })).toBe('written');
    expect(readFileSync(p, 'utf8')).toBe('two');
  });
  it('uses compare() so header-only differences skip', () => {
    const p = join(root, 'e.txt');
    ensureFile(p, 'H1\nbody');
    const compare = (s: string) => s.split('\n').slice(1).join('\n');
    expect(ensureFile(p, 'H2\nbody', { compare })).toBe('skipped-identical');
  });
  it('refuses to write through an existing symlink', () => {
    mkdirSync(join(root, 'real'));
    symlinkSync(join(root, 'real', 'target.txt'), join(root, 'link.txt'));
    expect(() => ensureFile(join(root, 'link.txt'), 'data')).toThrow(/symlink/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/fs-safe.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/fs-safe.js'".

- [ ] **Step 3: Implement `src/cli/fs-safe.js`**

```js
// @ts-check
import {
  openSync, writeSync, closeSync, readFileSync, lstatSync, realpathSync, existsSync, constants,
} from 'node:fs';
import { resolve, relative, dirname, sep } from 'node:path';

/** realpath the longest existing prefix of `p`, then re-append the missing tail. */
function realpathAllowingMissing(p) {
  let current = resolve(p);
  const tail = [];
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) break;
    tail.unshift(current.slice(parent.length + 1));
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
 * @param {{overwrite?: boolean, compare?: (s: string) => string}} [opts]
 * @returns {'written'|'skipped-identical'|'conflict'}
 */
export function ensureFile(filePath, content, { overwrite = false, compare } = {}) {
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
    if (!overwrite) return 'conflict';
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
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/fs-safe.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/fs-safe.js test/cli/fs-safe.test.ts
git commit -m "feat(cli): add project confinement + no-follow file writer"
```

---

### Task 7: `resolve-dir.js` — target-dir priority + persist rule

**Files:**
- Create: `src/cli/resolve-dir.js`
- Test: `test/cli/resolve-dir.test.ts`

**Interfaces:**
- Produces:
  - `detectDefaultDir(cwd: string): string`
  - `resolveTargetDir(opts: { flagDir?: string, cwd: string, config: { directory: string } | null }): { dir: string, persist: boolean, source: 'flag' | 'config' | 'detected' }`

- [ ] **Step 1: Write the failing test**

`test/cli/resolve-dir.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { detectDefaultDir, resolveTargetDir } from '../../src/cli/resolve-dir.js';

let cwd: string;
beforeEach(() => { cwd = mkdtempSync(join(tmpdir(), 'seira-rd-')); });
afterEach(() => { rmSync(cwd, { recursive: true, force: true }); });

describe('detectDefaultDir', () => {
  it('uses src/components/icons when src/ exists', () => {
    mkdirSync(join(cwd, 'src'));
    expect(detectDefaultDir(cwd)).toBe('src/components/icons');
  });
  it('uses components/icons when there is no src/', () => {
    expect(detectDefaultDir(cwd)).toBe('components/icons');
  });
});

describe('resolveTargetDir', () => {
  it('flag with no config → use flag AND persist', () => {
    expect(resolveTargetDir({ flagDir: 'x/y', cwd, config: null }))
      .toEqual({ dir: 'x/y', persist: true, source: 'flag' });
  });
  it('flag with existing config → per-run override, do NOT persist', () => {
    expect(resolveTargetDir({ flagDir: 'x/y', cwd, config: { directory: 'a/b' } }))
      .toEqual({ dir: 'x/y', persist: false, source: 'flag' });
  });
  it('config, no flag → use config, do NOT persist', () => {
    expect(resolveTargetDir({ cwd, config: { directory: 'a/b' } }))
      .toEqual({ dir: 'a/b', persist: false, source: 'config' });
  });
  it('no flag, no config → detect AND persist', () => {
    expect(resolveTargetDir({ cwd, config: null }))
      .toEqual({ dir: 'components/icons', persist: true, source: 'detected' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/resolve-dir.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/resolve-dir.js'".

- [ ] **Step 3: Implement `src/cli/resolve-dir.js`**

```js
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
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/resolve-dir.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/resolve-dir.js test/cli/resolve-dir.test.ts
git commit -m "feat(cli): add target-dir resolution with persist rule"
```

---

### Task 8: `names.js` — safe-name classification + suggestions

**Files:**
- Create: `src/cli/names.js`
- Test: `test/cli/names.test.ts`

**Interfaces:**
- Produces:
  - `classifyName(raw: string, known: Set<string>): { kind: 'ok', raw: string, name: string } | { kind: 'unknown', raw: string, name: string } | { kind: 'unsafe', raw: string }`
  - `suggest(query: string, allNames: string[], n?: number): string[]`

- [ ] **Step 1: Write the failing test**

`test/cli/names.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { classifyName, suggest } from '../../src/cli/names.js';

const known = new Set(['heart', 'heart-outline', 'star', 'star-outline', 'star-half']);

describe('classifyName', () => {
  it('accepts a known kebab name', () => {
    expect(classifyName('heart', known)).toEqual({ kind: 'ok', raw: 'heart', name: 'heart' });
  });
  it('normalizes PascalCase to a known name (helpful, not a security error)', () => {
    expect(classifyName('Heart', known)).toEqual({ kind: 'ok', raw: 'Heart', name: 'heart' });
  });
  it('marks a valid-shape but missing name as unknown', () => {
    expect(classifyName('star-filled', known)).toMatchObject({ kind: 'unknown', name: 'star-filled' });
  });
  it('marks path-traversal as unsafe', () => {
    expect(classifyName('../evil', known)).toMatchObject({ kind: 'unsafe' });
    expect(classifyName('a/b', known)).toMatchObject({ kind: 'unsafe' });
    expect(classifyName('heart\n', known)).toMatchObject({ kind: 'unsafe' });
  });
});

describe('suggest', () => {
  it('suggests near names for a typo', () => {
    const s = suggest('star-filled', [...known]);
    expect(s).toContain('star');
    expect(s.length).toBeGreaterThan(0);
    expect(s.length).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/names.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/names.js'".

- [ ] **Step 3: Implement `src/cli/names.js`**

```js
// @ts-check

/** unsafe = anything beyond [A-Za-z0-9-] (blocks `/`, `.`, `..`) or a control char */
function isUnsafeName(raw) {
  return /[^A-Za-z0-9-]/.test(raw) || /[\n\r\0]/.test(raw);
}

/**
 * @param {string} raw
 * @param {Set<string>} known
 * @returns {{kind:'ok',raw:string,name:string}|{kind:'unknown',raw:string,name:string}|{kind:'unsafe',raw:string}}
 */
export function classifyName(raw, known) {
  if (isUnsafeName(raw)) return { kind: 'unsafe', raw };
  const name = raw.toLowerCase();
  if (known.has(name)) return { kind: 'ok', raw, name };
  return { kind: 'unknown', raw, name };
}

/**
 * @param {string} query
 * @param {string[]} allNames
 * @param {number} [n]
 * @returns {string[]}
 */
export function suggest(query, allNames, n = 5) {
  const q = query.toLowerCase();
  /** @type {[number, string][]} */
  const scored = [];
  for (const name of allNames) {
    let score = -1;
    if (name === q) score = 1000;
    else if (name.startsWith(q)) score = 800 - (name.length - q.length);
    else if (name.includes(q)) score = 500;
    else {
      let i = 0;
      while (i < q.length && i < name.length && q[i] === name[i]) i++;
      if (i >= 3) score = i;
    }
    if (score >= 0) scored.push([score, name]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
  return scored.slice(0, n).map(([, name]) => name);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/names.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/names.js test/cli/names.test.ts
git commit -m "feat(cli): add name classification and suggestions"
```

---

### Task 9: `add.js` — orchestration (integration)

**Files:**
- Create: `src/cli/add.js`
- Test: `test/cli/add.test.ts`

**Interfaces:**
- Consumes: `assertInsideProject`, `ensureFile` (T6); `iconSource`, `typesSource`, `listIconNames` (T2); `transformIcon`, `transformTypes`, `contentWithoutHeader` (T4); `classifyName` (T8); `ioniconsLicenseText`, `TRADEMARKS_TEXT` (T3).
- Produces:
  - `addIcons(opts: { names: string[], dir: string, cwd: string, overwrite?: boolean, allowOutside?: boolean }): { dir: string, results: Array<{ name: string, status: string, isLogo: boolean }>, unknown: string[], shared: Array<[string, string]>, hasLogo: boolean }`

- [ ] **Step 1: Write the failing test**

`test/cli/add.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { addIcons } from '../../src/cli/add.js';

let cwd: string;
const dir = 'src/components/icons';
beforeEach(() => { cwd = mkdtempSync(join(tmpdir(), 'seira-add-')); });
afterEach(() => { rmSync(cwd, { recursive: true, force: true }); });

describe('addIcons', () => {
  it('copies icons + shared files with rewritten import', () => {
    const r = addIcons({ names: ['heart', 'star'], dir, cwd });
    const base = join(cwd, dir);
    expect(existsSync(join(base, 'heart.tsx'))).toBe(true);
    expect(existsSync(join(base, 'icon.types.ts'))).toBe(true);
    expect(existsSync(join(base, 'IONICONS-LICENSE'))).toBe(true);
    expect(readFileSync(join(base, 'heart.tsx'), 'utf8')).toContain("from './icon.types'");
    expect(r.results.every((x) => x.status === 'written')).toBe(true);
  });
  it('is idempotent: second run skips identical', () => {
    addIcons({ names: ['heart'], dir, cwd });
    const r = addIcons({ names: ['heart'], dir, cwd });
    expect(r.results[0].status).toBe('skipped-identical');
  });
  it('ships TRADEMARKS.md only when a logo is added', () => {
    const r = addIcons({ names: ['logo-github'], dir, cwd });
    expect(existsSync(join(cwd, dir, 'TRADEMARKS.md'))).toBe(true);
    expect(r.hasLogo).toBe(true);
  });
  it('collects unknown names without writing them', () => {
    const r = addIcons({ names: ['nope-not-real'], dir, cwd });
    expect(r.unknown).toEqual(['nope-not-real']);
  });
  it('throws on an unsafe name', () => {
    expect(() => addIcons({ names: ['../evil'], dir, cwd })).toThrow();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/add.test.ts`
Expected: FAIL "Cannot find module '../../src/cli/add.js'".

- [ ] **Step 3: Implement `src/cli/add.js`**

```js
// @ts-check
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { assertInsideProject, ensureFile } from './fs-safe.js';
import { iconSource, typesSource, listIconNames } from './paths.js';
import { transformIcon, transformTypes, contentWithoutHeader } from './transform.js';
import { classifyName } from './names.js';
import { ioniconsLicenseText, TRADEMARKS_TEXT } from './notices.js';

/**
 * @param {{names: string[], dir: string, cwd: string, overwrite?: boolean, allowOutside?: boolean}} opts
 */
export function addIcons({ names, dir, cwd, overwrite = false, allowOutside = false }) {
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

  mkdirSync(realDir, { recursive: true });

  /** @type {Array<[string, string]>} */
  const shared = [];
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

  /** @type {Array<{name: string, status: string, isLogo: boolean}>} */
  const results = [];
  for (const c of ok) {
    const src = /** @type {string} */ (iconSource(c.name));
    const isLogo = c.name.startsWith('logo-');
    const out = transformIcon(src, { name: c.name, isLogo });
    const status = ensureFile(join(realDir, `${c.name}.tsx`), out, {
      overwrite,
      compare: contentWithoutHeader,
    });
    results.push({ name: c.name, status, isLogo });
  }

  return { dir: realDir, results, unknown, shared, hasLogo };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/add.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cli/add.js test/cli/add.test.ts
git commit -m "feat(cli): add orchestration for copy-in add"
```

---

### Task 10: `bin/cli.js` — argv parsing, output, exit codes (e2e)

**Files:**
- Create: `bin/cli.js`
- Test: `test/cli/cli.test.ts`

**Interfaces:**
- Consumes: `readConfig`, `writeConfig` (T5); `resolveTargetDir` (T7); `addIcons` (T9); `suggest`, `listIconNames` (T8/T2).
- Produces: an executable that parses `add <names...> [--dir <path>] [--overwrite] [--allow-outside] [--help]`.

- [ ] **Step 1: Write the failing test**

`test/cli/cli.test.ts` (invokes the built CLI as a subprocess, exercising the published entry path):
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const CLI = fileURLToPath(new URL('../../bin/cli.js', import.meta.url));
let cwd: string;
beforeEach(() => { cwd = mkdtempSync(join(tmpdir(), 'seira-cli-')); });
afterEach(() => { rmSync(cwd, { recursive: true, force: true }); });

function run(args: string[]) {
  try {
    const stdout = execFileSync('node', [CLI, ...args], { cwd, encoding: 'utf8' });
    return { code: 0, stdout };
  } catch (e: any) {
    return { code: e.status ?? 1, stdout: (e.stdout ?? '') + (e.stderr ?? '') };
  }
}

describe('cli', () => {
  it('add writes the icon and echoes the resolved dir', () => {
    const r = run(['add', 'heart']);
    expect(r.code).toBe(0);
    expect(existsSync(join(cwd, 'components/icons/heart.tsx'))).toBe(true);
    expect(existsSync(join(cwd, 'seira-icons.json'))).toBe(true);
    expect(r.stdout).toContain('components/icons');
  });
  it('exits 1 and suggests on an unknown name', () => {
    const r = run(['add', 'star-filled']);
    expect(r.code).toBe(1);
    expect(r.stdout.toLowerCase()).toContain('did you mean');
  });
  it('warns when adding a logo', () => {
    const r = run(['add', 'logo-github']);
    expect(r.stdout.toLowerCase()).toContain('trademark');
  });
  it('prints help with no command', () => {
    const r = run([]);
    expect(r.stdout.toLowerCase()).toContain('usage');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/cli.test.ts`
Expected: FAIL (spawn ENOENT / no `bin/cli.js`).

- [ ] **Step 3: Implement `bin/cli.js`**

```js
#!/usr/bin/env node
// @ts-check
import { parseArgs } from 'node:util';
import { addIcons } from '../src/cli/add.js';
import { readConfig, writeConfig, CONFIG_NAME } from '../src/cli/config.js';
import { resolveTargetDir } from '../src/cli/resolve-dir.js';
import { listIconNames } from '../src/cli/paths.js';
import { suggest } from '../src/cli/names.js';

const HELP = `@seira-icons/ionicons — copy Ionicons React components into your project.

Usage:
  npx @seira-icons/ionicons add <names...> [options]

Names use the icon's kebab filename. Filled = bare name:
  heart (filled), heart-outline, heart-sharp

Options:
  --dir <path>       Target directory (default: src/components/icons or components/icons)
  --overwrite        Replace existing files (default: skip)
  --allow-outside    Permit a target directory outside the project
  -h, --help         Show this help

Browse names: https://ionic.io/ionicons  (TypeScript projects; requires jsx: "react-jsx")`;

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      dir: { type: 'string' },
      overwrite: { type: 'boolean', default: false },
      'allow-outside': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  const [cmd, ...names] = positionals;

  if (values.help || !cmd) {
    process.stdout.write(`${HELP}\n`);
    return cmd ? 0 : 0;
  }
  if (cmd !== 'add') {
    process.stderr.write(`Unknown command: ${cmd}\n\n${HELP}\n`);
    return 1;
  }
  if (names.length === 0) {
    process.stderr.write(`No icon names given.\n\n${HELP}\n`);
    return 1;
  }

  const cwd = process.cwd();
  const config = readConfig(cwd);
  const { dir, persist, source } = resolveTargetDir({ flagDir: values.dir, cwd, config });

  let report;
  try {
    report = addIcons({
      names,
      dir,
      cwd,
      overwrite: Boolean(values.overwrite),
      allowOutside: Boolean(values['allow-outside']),
    });
  } catch (err) {
    process.stderr.write(`Error: ${/** @type {Error} */ (err).message}\n`);
    return 1;
  }

  if (persist) {
    writeConfig(cwd, { directory: dir });
    process.stdout.write(`Icons → ${dir} (saved to ${CONFIG_NAME}; override with --dir)\n`);
  } else {
    process.stdout.write(`Icons → ${dir} (source: ${source})\n`);
  }

  for (const [name, status] of report.shared) {
    if (status === 'written') process.stdout.write(`  + ${name} (shared)\n`);
  }
  for (const r of report.results) {
    if (r.status === 'written') process.stdout.write(`  + ${r.name}.tsx\n`);
    else if (r.status === 'skipped-identical') process.stdout.write(`  = ${r.name}.tsx (already up to date)\n`);
    else if (r.status === 'conflict') {
      process.stdout.write(`  ! ${r.name}.tsx exists and differs — re-run with --overwrite to update\n`);
    }
    if (r.isLogo && r.status === 'written') {
      process.stdout.write(
        `    trademark: ${r.name} is a brand mark — MIT covers the artwork, not the mark (see TRADEMARKS.md)\n`,
      );
    }
  }

  let exit = 0;
  if (report.unknown.length) {
    exit = 1;
    const all = listIconNames();
    for (const u of report.unknown) {
      const near = suggest(u, all);
      const hint = near.length ? ` — did you mean: ${near.join(', ')}?` : '';
      process.stderr.write(`  ? unknown '${u}'${hint}\n`);
    }
  }
  return exit;
}

process.exit(main());
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/cli.test.ts`
Expected: PASS (4 tests).
Run: `npm run typecheck:cli`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add bin/cli.js test/cli/cli.test.ts
git commit -m "feat(cli): add bin entrypoint with argv parsing and output"
```

---

### Task 11: Copied-output compile test (golden guarantee)

Proves the transformed files actually typecheck in a strict consumer — the one check the spec (§8) calls out as mandatory and automated.

**Files:**
- Test: `test/cli/compile.test.ts`

**Interfaces:**
- Consumes: `addIcons` (T9).

- [ ] **Step 1: Write the failing test**

`test/cli/compile.test.ts` (writes real transformed output under the repo so `node_modules` resolves upward, then runs `tsc --noEmit`):
```ts
import { describe, it, expect, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { addIcons } from '../../src/cli/add.js';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const work = join(repoRoot, 'test/cli/__compile_tmp__');
afterEach(() => rmSync(work, { recursive: true, force: true }));

describe('copied output compiles under a strict consumer tsconfig', () => {
  it('tsc --noEmit exits 0', () => {
    mkdirSync(work, { recursive: true });
    // Copy a filled icon + a stroke/style icon into <work>/icons
    addIcons({ names: ['heart', 'heart-outline'], dir: 'icons', cwd: work });
    expect(existsSync(join(work, 'icons/icon.types.ts'))).toBe(true);

    const tsconfig = {
      compilerOptions: {
        strict: true,
        jsx: 'react-jsx',
        moduleResolution: 'bundler',
        module: 'ESNext',
        target: 'ES2020',
        noEmit: true,
        skipLibCheck: true,
        types: [],
      },
      include: ['icons/**/*.ts', 'icons/**/*.tsx'],
    };
    writeFileSync(join(work, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    const tsc = join(repoRoot, 'node_modules/.bin/tsc');
    // throws (non-zero exit) if the copied output fails to typecheck
    execFileSync(tsc, ['--noEmit', '-p', join(work, 'tsconfig.json')], {
      cwd: work,
      encoding: 'utf8',
    });
    expect(true).toBe(true);
  }, 60_000);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run test/cli/compile.test.ts`
Expected: FAIL if any earlier module is missing; otherwise it should already PASS once Tasks 2–9 exist. If it FAILS on a real typecheck error, fix the transform/header — do not weaken the test.

- [ ] **Step 3: (No new impl unless the test surfaces a defect.)**

If `tsc` reports an error in copied output (e.g. header placement, import path), fix `transform.js`/`notices.js` and re-run. Otherwise proceed.

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run test/cli/compile.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add test/cli/compile.test.ts
git commit -m "test(cli): compile copied output under a strict consumer tsconfig"
```

---

### Task 12: CI wiring — typecheck:cli, tests, and pack smoke test

Adds the one integration check that catches `type:module` / `files` regressions: pack the tarball and run `npx <tgz> add` in a clean temp dir.

**Files:**
- Create: `test/cli/pack-smoke.test.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: the packaged CLI (via `npm pack`).

- [ ] **Step 1: Write the failing test**

`test/cli/pack-smoke.test.ts`:
```ts
import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, execFileSync } from 'node:child_process';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const staging = mkdtempSync(join(tmpdir(), 'seira-pack-'));
afterAll(() => rmSync(staging, { recursive: true, force: true }));

describe('packaged CLI runs from the tarball', () => {
  it('npm pack → extract → node bin/cli.js add heart writes files', () => {
    // Pack the tarball into a staging dir
    const tgzName = execSync(`npm pack --pack-destination "${staging}"`, {
      cwd: repoRoot,
      encoding: 'utf8',
    }).trim().split('\n').pop()!.trim();
    const tgz = join(staging, tgzName);
    expect(existsSync(tgz)).toBe(true);

    // Extract and confirm src/ and icons/ are present (files allowlist correctness)
    execFileSync('tar', ['-xzf', tgz, '-C', staging], { encoding: 'utf8' });
    const pkgDir = join(staging, 'package');
    expect(existsSync(join(pkgDir, 'src/cli/add.js'))).toBe(true);
    expect(existsSync(join(pkgDir, 'icons/heart.tsx'))).toBe(true);

    // Run the packaged bin from a clean consumer dir
    const consumer = join(staging, 'consumer');
    execFileSync('mkdir', ['-p', consumer]);
    execFileSync('node', [join(pkgDir, 'bin/cli.js'), 'add', 'heart', '--dir', 'icons'], {
      cwd: consumer,
      encoding: 'utf8',
    });
    expect(existsSync(join(consumer, 'icons/heart.tsx'))).toBe(true);
    expect(readdirSync(join(consumer, 'icons'))).toContain('icon.types.ts');
  }, 120_000);
});
```

- [ ] **Step 2: Run to verify it fails / passes**

Run: `npx vitest run test/cli/pack-smoke.test.ts`
Expected: PASS if `package.json` `files`/`type` are correct (Task 1). If it FAILS with `ERR_MODULE_NOT_FOUND`, `files` is missing `src` — fix Task 1's `package.json`.

- [ ] **Step 3: Update CI**

Replace `.github/workflows/ci.yml` job steps so both typechecks, tests, and the pack smoke run:
```yaml
name: CI

on:
  pull_request:
    branches: [master]
  push:
    branches: [master]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    name: Typecheck & Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run typecheck:cli
      - run: npm test
```
(The pack-smoke test runs as part of `npm test` since it lives under `test/`.)

- [ ] **Step 4: Verify locally**

Run: `npm run typecheck && npm run typecheck:cli && npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add test/cli/pack-smoke.test.ts .github/workflows/ci.yml
git commit -m "test(cli): add pack smoke test and wire CI"
```

---

### Task 13: Docs + cleanup

**Files:**
- Modify: `README.md`
- Delete: `test/cli/scaffold.test.ts` (temporary liveness test from Task 1)

**Interfaces:** none.

- [ ] **Step 1: Add a CLI section to `README.md`**

Insert after the installation/usage section:
```markdown
## CLI (copy-in)

Copy only the icons you need into your project — no runtime dependency:

    npx @seira-icons/ionicons add heart heart-outline

- Names use the icon's **kebab filename**. The **filled** variant is the bare
  name: `heart` (filled), `heart-outline`, `heart-sharp`.
- Files land in `src/components/icons` (or `components/icons` if you have no
  `src/`). Override with `--dir <path>`; the choice is saved to
  `seira-icons.json`.
- Existing files are **skipped**; pass `--overwrite` to update them.
- A shared `icon.types.ts` and `IONICONS-LICENSE` are copied alongside.
- Brand `logo-*` icons also copy a `TRADEMARKS.md`; MIT covers the artwork,
  not the mark.

**Requirements:** TypeScript, `jsx: "react-jsx"`, and `@types/react`.
`moduleResolution` `bundler` or classic `node` (extensionless relative imports;
`node16`/`nodenext` require adding `.js` extensions yourself).
```

- [ ] **Step 2: Remove the temporary scaffold test**

```bash
git rm test/cli/scaffold.test.ts
```

- [ ] **Step 3: Verify the suite is still green**

Run: `npm test`
Expected: PASS (scaffold gone; all CLI tests remain).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(cli): document the add command and consumer requirements"
```

---

## Self-Review

**Spec coverage:**
- §2/§2.1 decisions → Tasks 2–10 (identifier T8, path T7, shared type T3/T4/T9, license T3/T9, logo T3/T9, overwrite T6, config T5, CLI lang T1, parseArgs T10). ✅
- §3 architecture (modules) → Tasks 2–10 map 1:1 to `paths/notices/transform/config/fs-safe/resolve-dir/names/add` + `bin/cli`. ✅
- §5 transform/license → T3 (headers, IONICONS-LICENSE from THIRD_PARTY_LICENSES), T4 (guarded rewrite). ✅
- §6 packaging (`type:module`, `bin`, `files`, `engines`, `publishConfig`, `.gitattributes`) → T1. ✅
- §7 security (confinement, no-follow, name whitelist, no deep-merge) → T6 (fs), T8 (names), T5 (config). ✅
- §8 tests (unit, integration, compile, pack smoke) → T2–T12. ✅
- §10 consumer requirements + §11 discoverability → T13 (README), T10 (help + suggestions). ✅

**Placeholder scan:** No TBD/TODO; every code step carries full code. ✅

**Type consistency:** `ensureFile` return union (`'written'|'skipped-identical'|'conflict'`) is produced in T6 and consumed identically in T9/T10. `classifyName` discriminated union produced T8, consumed T9. `resolveTargetDir` `{dir,persist,source}` produced T7, consumed T10. `addIcons` report shape produced T9, consumed T10. ✅

**Note for implementer:** `O_NOFOLLOW`/`O_EXCL` are POSIX; on Windows `openSync` ignores `O_NOFOLLOW` (symlink creation there needs admin anyway). The confinement `realpath` check in `assertInsideProject` remains the primary guard cross-platform.
