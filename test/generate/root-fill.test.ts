import { describe, it, expect } from 'vitest';
import { svgToComponent } from '../../scripts/generate/svg-to-component.js';

// The committed fixtures happen to all lack a root `fill`, so they never
// exercised the ~9 outline/logo icons whose source declares `fill="none"`.
// These cases pin the root-fill rule directly.
describe('svgToComponent root fill handling', () => {
  it('preserves a source root fill="none" instead of forcing currentColor', async () => {
    const src =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 512">' +
      '<path stroke="#000" stroke-width="32" d="M0 0h100"/></svg>';
    const out = await svgToComponent(src, { name: 'demo-outline' });
    expect(out).toContain("fill='none'");
    expect(out).not.toContain("fill='currentColor'");
  });

  it("injects fill='currentColor' when the source root declares no fill", async () => {
    const src =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
      '<path d="M0 0h100"/></svg>';
    const out = await svgToComponent(src, { name: 'demo' });
    expect(out).toContain("fill='currentColor'");
  });

  it('keeps a non-512 source viewBox and a child fill (logo-x shape)', async () => {
    const src =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">' +
      '<path fill="currentColor" d="M9 6 14 1h-1L8 6 5 1H1l5 7-5 7h1l4-5 3 5h4z"/></svg>';
    const out = await svgToComponent(src, { name: 'logo-demo' });
    expect(out).toContain("viewBox='0 0 16 16'");
    expect(out).toContain("fill='none'");
    expect(out).toContain("fill='currentColor'"); // the child path keeps its fill
  });

  it('throws a clear error when the source has no viewBox', async () => {
    const src = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h4"/></svg>';
    await expect(svgToComponent(src, { name: 'x' })).rejects.toThrow(/viewBox/);
  });
});
