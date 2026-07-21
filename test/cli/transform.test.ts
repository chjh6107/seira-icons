import { describe, it, expect } from 'vitest';
import { transformIcon, transformTypes, contentWithoutHeader } from '../../src/cli/transform.js';

const ICON = `import type { IconProps } from './types';\nconst Heart = () => null;\nexport default Heart;\n`;

describe('transformIcon', () => {
  it('rewrites the shared-type import and prepends a header', () => {
    const out = transformIcon(ICON, { name: 'heart' });
    expect(out).toContain("from './icon.types'");
    expect(out).not.toContain("from './types'");
    expect(out.startsWith('/*!')).toBe(true);
    expect(out.split('\n')[1]).toContain('import type');
  });
  it('adds a trademark line for logos', () => {
    const out = transformIcon(ICON, { name: 'logo-github', isLogo: true });
    expect(out).toContain('./TRADEMARKS.md');
  });
  it('throws if the import is missing (future drift guard)', () => {
    expect(() => transformIcon(`const X = () => null;`, { name: 'x' })).toThrow();
  });
  it('throws if the import appears twice', () => {
    expect(() => transformIcon(ICON + ICON, { name: 'dup' })).toThrow();
  });
  it('attributes originals (e.g. Spinner) to the project, not Ionicons', () => {
    const out = transformIcon(ICON, { name: 'spinner', isOriginal: true });
    expect(out).toContain('original component, not part of Ionicons');
    expect(out).not.toContain('Ionicons (c) 2015-present Ionic');
  });
});

describe('transformTypes', () => {
  it('prepends our own header', () => {
    expect(transformTypes('export type IconProps = {};').startsWith('/*!')).toBe(true);
  });
});

describe('contentWithoutHeader', () => {
  it('strips a leading block comment so header changes do not flip skips', () => {
    const a = contentWithoutHeader(`/*! OLD */\nbody`);
    const b = contentWithoutHeader(`/*! NEW header text */\nbody`);
    expect(a).toBe(b);
    expect(a).toBe('body');
  });
});
