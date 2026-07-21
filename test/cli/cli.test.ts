import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
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
  it('an all-unknown run exits 1 and does not create seira-icons.json', () => {
    const r = run(['add', 'definitely-bogus']);
    expect(r.code).toBe(1);
    expect(existsSync(join(cwd, 'seira-icons.json'))).toBe(false);
  });
  it('generates a barrel by default and prints it', () => {
    const r = run(['add', 'heart']);
    expect(existsSync(join(cwd, 'components/icons/index.ts'))).toBe(true);
    expect(r.stdout).toContain('index.ts (barrel');
  });
  it('--no-barrel skips the barrel and persists barrel:false', () => {
    const r = run(['add', 'heart', '--no-barrel']);
    expect(r.code).toBe(0);
    expect(existsSync(join(cwd, 'components/icons/index.ts'))).toBe(false);
    const cfg = JSON.parse(readFileSync(join(cwd, 'seira-icons.json'), 'utf8'));
    expect(cfg.barrel).toBe(false);
    // subsequent add (no flag) stays off because config says so
    run(['add', 'star']);
    expect(existsSync(join(cwd, 'components/icons/index.ts'))).toBe(false);
  });
});
