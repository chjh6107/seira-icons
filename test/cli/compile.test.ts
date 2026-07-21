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

it('a consumer importing from the generated barrel typechecks', () => {
  mkdirSync(work, { recursive: true });
  addIcons({ names: ['heart', 'heart-outline'], dir: 'icons', cwd: work }); // barrel default on
  expect(existsSync(join(work, 'icons/index.ts'))).toBe(true);

  const tsconfig = {
    compilerOptions: {
      strict: true, jsx: 'react-jsx', moduleResolution: 'bundler',
      module: 'ESNext', target: 'ES2020', noEmit: true, skipLibCheck: true, types: [],
    },
    include: ['**/*.ts', '**/*.tsx'],
  };
  writeFileSync(join(work, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  // consumer imports via the barrel
  writeFileSync(
    join(work, 'consumer.tsx'),
    `import { Heart, HeartOutline, type IconProps } from './icons';\n` +
      `const props: IconProps = { size: 16 };\n` +
      `export const A = () => <><Heart {...props} /><HeartOutline /></>;\n`,
  );
  const tsc = join(repoRoot, 'node_modules/.bin/tsc');
  execFileSync(tsc, ['--noEmit', '-p', join(work, 'tsconfig.json')], { cwd: work, encoding: 'utf8' });
  expect(true).toBe(true);
}, 60_000);
