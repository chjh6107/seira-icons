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
  it('uses allowOverwrite(existing) to decide overwrite when the file differs', () => {
    const p = join(root, 'f.txt');
    ensureFile(p, 'v1');
    // predicate false → conflict (not overwritten)
    expect(ensureFile(p, 'v2', { allowOverwrite: () => false })).toBe('conflict');
    expect(readFileSync(p, 'utf8')).toBe('v1');
    // predicate true → written
    expect(ensureFile(p, 'v2', { allowOverwrite: () => true })).toBe('written');
    expect(readFileSync(p, 'utf8')).toBe('v2');
  });
  it('allowOverwrite receives the existing content', () => {
    const p = join(root, 'g.txt');
    ensureFile(p, 'MARK\nbody');
    let seen = '';
    ensureFile(p, 'MARK\nother', { allowOverwrite: (existing) => { seen = existing; return true; } });
    expect(seen).toBe('MARK\nbody');
  });
});
