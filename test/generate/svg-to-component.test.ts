import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { svgToComponent } from '../../scripts/generate/svg-to-component.js';

const here = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(here, 'fixtures');
const GOLDEN = join(here, '../../icons');

const svgs = readdirSync(FIXTURES).filter((f) => f.endsWith('.svg'));

describe('svgToComponent reproduces the committed icon components byte-for-byte', () => {
  it('has fixtures to check', () => {
    expect(svgs.length).toBeGreaterThan(0);
  });

  for (const file of svgs) {
    const name = file.replace(/\.svg$/, '');
    it(`${name}.svg → icons/${name}.tsx`, async () => {
      const source = readFileSync(join(FIXTURES, file), 'utf8');
      const golden = readFileSync(join(GOLDEN, `${name}.tsx`), 'utf8');
      expect(await svgToComponent(source, { name })).toBe(golden);
    });
  }
});
