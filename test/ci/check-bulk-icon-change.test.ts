import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('../../scripts/ci/check-bulk-icon-change.sh', import.meta.url));

let repo: string;

const gitIn = (cwd: string, ...args: string[]) => execFileSync('git', args, { cwd, encoding: 'utf8' });

const git = (...args: string[]) => gitIn(repo, ...args);

/** Change `count` icon files and commit them with `message`. */
const commitIcons = (count: number, message: string) => {
  for (let i = 0; i < count; i++) {
    writeFileSync(join(repo, 'icons', `icon-${i}.tsx`), `// rev ${Math.abs(i * 7)}\n`);
  }
  git('add', '-A');
  git('commit', '-q', '-m', message);
};

/** @returns the script's exit code — 0 allow, 1 refuse. */
const checkIn = (cwd: string, threshold?: string): number => {
  try {
    execFileSync('bash', [SCRIPT, 'main'], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, ...(threshold ? { ICON_CHANGE_THRESHOLD: threshold } : {}) },
    });
    return 0;
  } catch (err) {
    return (err as { status: number }).status;
  }
};

const check = (threshold?: string): number => checkIn(repo, threshold);

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

  // The token is read from the whole log, and the log can outgrow the 64 KB
  // pipe buffer. A matcher that stops at the first hit strands git mid-write,
  // and the escape hatch turns into a refusal on exactly the branches — long,
  // heavily described ones — most likely to need it.
  it('honours [bulk-icons] when the log outgrows the pipe buffer', () => {
    const big = mkdtempSync(join(tmpdir(), 'bulk-icon-biglog-'));
    try {
      gitIn(big, 'init', '-q', '-b', 'main');
      gitIn(big, 'config', 'user.email', 'test@example.com');
      gitIn(big, 'config', 'user.name', 'test');
      mkdirSync(join(big, 'icons'));
      writeFileSync(join(big, 'icons', 'seed.tsx'), '// seed\n');
      gitIn(big, 'add', '-A');
      gitIn(big, 'commit', '-q', '-m', 'seed');
      gitIn(big, 'checkout', '-q', '-b', 'topic');

      for (let i = 0; i < 25; i++) {
        writeFileSync(join(big, 'icons', `icon-${i}.tsx`), `// rev ${i}\n`);
      }
      gitIn(big, 'add', '-A');
      // Via a file, not `-m`: Linux caps a single argv entry at 128 KB, and a
      // body that size is the point of the test. The file stays untracked, so
      // neither this commit nor the next one picks it up.
      const body = join(big, 'commit-body.txt');
      writeFileSync(body, `chore: rewrite the set\n\n${'x'.repeat(128 * 1024)}\n`);
      gitIn(big, 'commit', '-q', '-F', body);
      // Newest, so a matcher that exits early does so while git still has
      // 128 KB left to write.
      gitIn(big, 'commit', '-q', '--allow-empty', '-m', 'chore: regenerate [bulk-icons]');

      expect(checkIn(big, '20')).toBe(0);
    } finally {
      rmSync(big, { recursive: true, force: true });
    }
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
