import { describe, it, expect } from 'vitest';
import { classifyName, suggest } from '../../src/cli/names.js';

const known = new Set(['heart', 'heart-outline', 'star', 'star-outline', 'star-half']);

describe('classifyName', () => {
  it('accepts a known kebab name', () => {
    expect(classifyName('heart', known)).toEqual({ kind: 'ok', raw: 'heart', name: 'heart' });
  });
  it('normalizes PascalCase to a known name (helpful, not a security error)', () => {
    expect(classifyName('Heart', known)).toEqual({ kind: 'ok', raw: 'Heart', name: 'heart' });
  });
  it('marks a valid-shape but missing name as unknown', () => {
    expect(classifyName('star-filled', known)).toMatchObject({ kind: 'unknown', name: 'star-filled' });
  });
  it('marks path-traversal as unsafe', () => {
    expect(classifyName('../evil', known)).toMatchObject({ kind: 'unsafe' });
    expect(classifyName('a/b', known)).toMatchObject({ kind: 'unsafe' });
    expect(classifyName('heart\n', known)).toMatchObject({ kind: 'unsafe' });
  });
});

describe('suggest', () => {
  it('suggests near names for a typo', () => {
    const s = suggest('star-filled', [...known]);
    expect(s).toContain('star');
    expect(s.length).toBeGreaterThan(0);
    expect(s.length).toBeLessThanOrEqual(5);
  });
});
