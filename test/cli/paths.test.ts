import { describe, it, expect } from 'vitest';
import { iconSource, typesSource, packageFile, listIconNames } from '../../src/cli/paths.js';

describe('paths', () => {
  it('reads a known icon source', () => {
    const src = iconSource('heart');
    expect(src).toContain("from './types'");
    expect(src).toContain('const Heart');
  });
  it('returns null for an unknown icon', () => {
    expect(iconSource('definitely-not-an-icon')).toBeNull();
  });
  it('reads the shared types source', () => {
    expect(typesSource()).toContain('IconProps');
  });
  it('reads a package-root file', () => {
    expect(packageFile('THIRD_PARTY_LICENSES')).toContain('The MIT License');
  });
  it('lists icon names without extension and excludes types', () => {
    const names = listIconNames();
    expect(names).toContain('heart');
    expect(names).not.toContain('types');
    expect(names.length).toBeGreaterThan(1000);
  });
});
