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
