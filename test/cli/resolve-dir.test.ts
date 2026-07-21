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
