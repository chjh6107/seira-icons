import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  MARKER, MARKER_TOKEN, parseExportMap, exportNameMap, buildBarrel, isManaged, ensureBarrel,
} from '../../src/cli/barrel.js';
import { addIcons } from '../../src/cli/add.js';

describe('parseExportMap', () => {
  it('maps kebab → Pascal from real index.ts and covers 1357', () => {
    const map = exportNameMap();
    expect(map.get('heart')).toBe('Heart');
    expect(map.get('heart-outline')).toBe('HeartOutline');
    expect(map.get('logo-github')).toBe('LogoGithub');
    expect(map.get('logo-css3')).toBe('LogoCss3');
    expect(map.get('spinner')).toBe('Spinner');
    expect(map.size).toBe(1357);
  });
  it('throws if the parse collapses (format changed)', () => {
    expect(() => parseExportMap('garbage\nnot a match')).toThrow();
  });
});

describe('buildBarrel', () => {
  it('emits marker, type line, sorted named re-exports, single trailing newline', () => {
    const out = buildBarrel(['star', 'heart', 'heart-outline'], { hasTypes: true });
    expect(out.split('\n')[0]).toBe(MARKER);
    expect(out).toContain(`export type { IconProps } from './icon.types';`);
    // sorted by kebab: heart, heart-outline, star
    const idxHeart = out.indexOf("from './heart'");
    const idxStar = out.indexOf("from './star'");
    expect(idxHeart).toBeGreaterThan(-1);
    expect(idxHeart).toBeLessThan(idxStar);
    expect(out).toContain(`export { default as HeartOutline } from './heart-outline';`);
    expect(out.endsWith('\n')).toBe(true);
    expect(out.endsWith('\n\n')).toBe(false);
  });
  it('omits the type line when hasTypes is false and drops unknown basenames', () => {
    const out = buildBarrel(['heart', 'not-a-real-icon'], { hasTypes: false });
    expect(out).not.toContain('IconProps');
    expect(out).toContain(`export { default as Heart } from './heart';`);
    expect(out).not.toContain('not-a-real-icon');
  });
});

describe('isManaged', () => {
  it('recognizes our own marker across BOM/CRLF/trailing space', () => {
    expect(isManaged(buildBarrel(['heart'], { hasTypes: false }))).toBe(true); // round-trip
    expect(isManaged(MARKER)).toBe(true);
    expect(isManaged('﻿' + MARKER + '\nx')).toBe(true);
    expect(isManaged(MARKER + '\r\nx')).toBe(true);
    expect(isManaged(MARKER_TOKEN + ' extra tail\nx')).toBe(true);
  });
  it('treats a user-authored file as unmanaged', () => {
    expect(isManaged('// my own icons barrel\nexport {} from "./x";')).toBe(false);
    expect(isManaged('')).toBe(false);
  });
});

describe('ensureBarrel (called directly — add.js wiring is Task 4)', () => {
  let dir: string;
  beforeEach(() => { dir = mkdtempSync(join(tmpdir(), 'seira-barrel-')); });
  afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

  // NOTE: addIcons wires ensureBarrel in by default (Task 4), so these calls pass
  // barrel:false to keep only copying icon files, letting us drive ensureBarrel's
  // written/skipped-identical state transitions directly and deterministically.
  it('writes a barrel from folder icons, updates on new icons, and is idempotent', () => {
    addIcons({ names: ['heart'], dir: 'icons', cwd: dir, barrel: false });
    const target = join(dir, 'icons');
    const idx = join(target, 'index.ts');
    expect(ensureBarrel(target).status).toBe('written');
    expect(readFileSync(idx, 'utf8')).toContain(`export { default as Heart } from './heart';`);
    // a new icon file appears → regenerate includes it
    addIcons({ names: ['star'], dir: 'icons', cwd: dir, barrel: false });
    expect(ensureBarrel(target).status).toBe('written');
    const after = readFileSync(idx, 'utf8');
    expect(after).toContain(`export { default as Heart } from './heart';`);
    expect(after).toContain(`export { default as Star } from './star';`);
    // no change → idempotent
    expect(ensureBarrel(target).status).toBe('skipped-identical');
  });
  it('does not clobber an unmanaged index.ts', () => {
    addIcons({ names: ['heart'], dir: 'icons', cwd: dir });
    const target = join(dir, 'icons');
    const idx = join(target, 'index.ts');
    writeFileSync(idx, '// hand written\nexport const x = 1;\n');
    const before = readFileSync(idx, 'utf8');
    expect(ensureBarrel(target).status).toBe('skipped-unmanaged');
    expect(readFileSync(idx, 'utf8')).toBe(before);
  });
});
