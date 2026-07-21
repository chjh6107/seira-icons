import { mkdtempSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterAll, describe, it, expect } from 'vitest';
import { generateIcons } from '../../scripts/generate/generate-icons.js';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(here, 'fixtures');
const GOLDEN = join(here, '../../icons');

const tmp = mkdtempSync(join(tmpdir(), 'gen-icons-'));

afterAll(() => {
  // best-effort cleanup; tmpdir entries are disposable
});

describe('generateIcons converts every SVG in a directory', () => {
  it('writes one .tsx per source .svg, byte-identical to the committed icons', async () => {
    const out = join(tmp, 'out');
    const report = await generateIcons({ inputDir: FIXTURES, outputDir: out });

    const svgCount = readdirSync(FIXTURES).filter((f) => f.endsWith('.svg')).length;
    expect(report.written).toBe(svgCount);

    const produced = readdirSync(out).filter((f) => f.endsWith('.tsx'));
    expect(produced.length).toBe(svgCount);

    for (const file of produced) {
      const golden = readFileSync(join(GOLDEN, file), 'utf8');
      expect(readFileSync(join(out, file), 'utf8'), file).toBe(golden);
    }
  });

  it('creates the output directory if it does not exist', async () => {
    const out = join(tmp, 'nested', 'deep');
    await generateIcons({ inputDir: FIXTURES, outputDir: out });
    expect(readdirSync(out).length).toBeGreaterThan(0);
  });

  it('ignores non-svg files in the input directory', async () => {
    const input = join(tmp, 'mixed');
    mkdirSync(input, { recursive: true });
    writeFileSync(join(input, 'heart.svg'), readFileSync(join(FIXTURES, 'add.svg')));
    writeFileSync(join(input, 'README.md'), '# not an icon');
    const out = join(tmp, 'mixed-out');
    const report = await generateIcons({ inputDir: input, outputDir: out });
    expect(report.written).toBe(1);
    expect(readdirSync(out)).toEqual(['heart.tsx']);
  });
});
