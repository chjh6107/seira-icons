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
  it('round-trips an optional barrel flag', () => {
    writeConfig(dir, { directory: 'components/icons', barrel: false });
    expect(readConfig(dir)).toEqual({ directory: 'components/icons', barrel: false });
  });
  it('omits barrel when not provided', () => {
    writeConfig(dir, { directory: 'components/icons' });
    expect(readConfig(dir)).toEqual({ directory: 'components/icons' });
  });
  it('ignores a non-boolean barrel value', () => {
    writeFileSync(join(dir, CONFIG_NAME), JSON.stringify({ directory: 'x', barrel: 'nope' }));
    expect(readConfig(dir)).toEqual({ directory: 'x' });
  });
});
