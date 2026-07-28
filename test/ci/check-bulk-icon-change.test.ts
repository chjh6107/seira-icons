import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('../../scripts/ci/check-bulk-icon-change.sh', import.meta.url));

let repo: string;

const git = (...args: string[]) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });

/** Change `count` icon files and commit them with `message`. */
const commitIcons = (count: number, message: string) => {
  for (let i = 0; i < count; i++) {
    writeFileSync(join(repo, 'icons', `icon-${i}.tsx`), `// rev ${Math.abs(i * 7)}\n`);
  }
  git('add', '-A');
  git('commit', '-q', '-m', message);
};

/** @returns the script's exit code — 0 allow, 1 refuse. */
const check = (threshold?: string): number => {
  try {
    execFileSync('bash', [SCRIPT, 'main'], {
      cwd: repo,
      encoding: 'utf8',
      env: { ...process.env, ...(threshold ? { ICON_CHANGE_THRESHOLD: threshold } : {}) },
    });
    return 0;
  } catch (err) {
    return (err as { status: number }).status;
  }
};

beforeAll(() => {
  repo = mkdtempSync(join(tmpdir(), 'bulk-icon-'));
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  mkdirSync(join(repo, 'icons'));
  writeFileSync(join(repo, 'icons', 'seed.tsx'), '// seed\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'seed');
  git('checkout', '-q', '-b', 'topic');
});

afterAll(() => rmSync(repo, { recursive: true, force: true }));

describe('check-bulk-icon-change', () => {
  it('allows a change under the threshold', () => {
    commitIcons(3, 'fix: three icons');

    expect(check('20')).toBe(0);
  });

  it('refuses a change over the threshold', () => {
    commitIcons(25, 'chore: rewrite the set');

    expect(check('20')).toBe(1);
  });

  it('allows the same change when a commit carries [bulk-icons]', () => {
    git('commit', '-q', '--allow-empty', '-m', 'chore: regenerate [bulk-icons]');

    expect(check('20')).toBe(0);
  });

  it('exits 2 without a base ref, rather than passing silently', () => {
    let status = 0;
    try {
      execFileSync('bash', [SCRIPT], { cwd: repo, encoding: 'utf8' });
    } catch (err) {
      status = (err as { status: number }).status;
    }

    expect(status).toBe(2);
  });
});
