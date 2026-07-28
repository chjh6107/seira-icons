import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildBarrel, BARREL_BANNER } from '../../scripts/generate/generate-barrel.js';

const ICONS_DIR = fileURLToPath(new URL('../../icons', import.meta.url));

describe('buildBarrel', () => {
  it('reproduces the committed icons/index.ts byte-for-byte', () => {
    // index.ts has been hand-maintained until now; this pins the exact format
    // so regenerating it is a no-op instead of a 1,358-line diff.
    const files = readdirSync(ICONS_DIR).filter((f) => f.endsWith('.tsx'));

    expect(buildBarrel(files)).toBe(readFileSync(join(ICONS_DIR, 'index.ts'), 'utf8'));
  });

  it('orders by filename, so `-` sorts ahead of `.`', () => {
    // `accessibility-outline` precedes `accessibility` because '-' (0x2D) < '.' (0x2E).
    // Sorting the basenames instead would silently reverse those two lines.
    expect(buildBarrel(['accessibility.tsx', 'accessibility-outline.tsx'])).toBe(
      `${BARREL_BANNER}\n` +
        "export type { IconProps } from './types';\n" +
        "export { default as AccessibilityOutline } from './accessibility-outline';\n" +
        "export { default as Accessibility } from './accessibility';\n",
    );
  });

  it('converts kebab-case filenames to PascalCase exports', () => {
    expect(buildBarrel(['logo-react.tsx'])).toContain(
      "export { default as LogoReact } from './logo-react';",
    );
  });

  it('ignores non-component files that live alongside the icons', () => {
    const out = buildBarrel(['heart.tsx', 'index.ts', 'types.ts', 'README.md']);

    expect(out).toContain("from './heart'");
    expect(out).not.toContain("from './index'");
    expect(out).not.toContain("from './types'\n");
  });

  it('refuses an empty icon set rather than emitting a barrel that drops every export', () => {
    expect(() => buildBarrel([])).toThrow(/no icon components/i);
  });
});
