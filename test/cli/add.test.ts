import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
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
  it('attributes the Spinner original to the project, not Ionicons', () => {
    const r = addIcons({ names: ['spinner'], dir, cwd });
    const base = join(cwd, dir);
    const content = readFileSync(join(base, 'spinner.tsx'), 'utf8');
    expect(content).toContain('original component, not part of Ionicons');
    expect(r.results[0].status).toBe('written');
  });
  it('does not write shared files or config on an all-unknown (no-op) run', () => {
    const r = addIcons({ names: ['definitely-bogus'], dir, cwd });
    const base = join(cwd, dir);
    expect(existsSync(join(base, 'icon.types.ts'))).toBe(false);
    expect(existsSync(join(base, 'IONICONS-LICENSE'))).toBe(false);
    expect(r.results).toEqual([]);
  });
  it('generates a barrel index.ts by default', () => {
    const r = addIcons({ names: ['heart', 'star'], dir, cwd });
    const idx = join(cwd, dir, 'index.ts');
    expect(existsSync(idx)).toBe(true);
    expect(readFileSync(idx, 'utf8')).toContain(`export { default as Heart } from './heart';`);
    expect(r.barrel?.status).toBe('written');
    expect(r.barrel?.count).toBe(2);
  });
  it('skips the barrel when barrel:false', () => {
    const r = addIcons({ names: ['heart'], dir, cwd, barrel: false });
    expect(existsSync(join(cwd, dir, 'index.ts'))).toBe(false);
    expect(r.barrel).toBeUndefined();
  });
  it('does not touch an unmanaged index.ts even with overwrite', () => {
    addIcons({ names: ['heart'], dir, cwd, barrel: false });
    const idx = join(cwd, dir, 'index.ts');
    writeFileSync(idx, '// mine\nexport const x = 1;\n');
    const r = addIcons({ names: ['star'], dir, cwd, overwrite: true });
    expect(readFileSync(idx, 'utf8')).toBe('// mine\nexport const x = 1;\n');
    expect(r.barrel?.status).toBe('skipped-unmanaged');
  });
});
