import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Heart, Accessibility, LogoX, Spinner } from '../icons';

const html = (el: ReactElement) => renderToStaticMarkup(el);

describe('icon size contract', () => {
  it('defaults to 24×24 when no size is given (old 512 default is gone)', () => {
    const out = html(<Heart />);
    expect(out).toContain('width="24"');
    expect(out).toContain('height="24"');
    expect(out).not.toContain('width="512"');
    expect(out).not.toContain('height="512"');
  });

  it('`size` sets both width and height (number → px)', () => {
    const out = html(<Heart size={32} />);
    expect(out).toContain('width="32"');
    expect(out).toContain('height="32"');
  });

  it('`size` accepts a CSS length string', () => {
    const out = html(<Heart size="1em" />);
    expect(out).toContain('width="1em"');
    expect(out).toContain('height="1em"');
  });

  it('explicit width/height override `size` (props spread last)', () => {
    const out = html(<Heart size={32} width={40} height={40} />);
    expect(out).toContain('width="40"');
    expect(out).toContain('height="40"');
    expect(out).not.toContain('width="32"');
  });

  it('normalizes formerly-dimensionless icons to the same 24 default', () => {
    const out = html(<Accessibility />);
    expect(out).toContain('width="24"');
    expect(out).toContain('height="24"');
  });

  it('does not leak the `size` prop onto the DOM', () => {
    // leading space targets a standalone ` size=` attribute, not e.g. `font-size=`
    expect(html(<Heart size={24} />)).not.toContain(' size=');
  });

  it('preserves each icon’s own viewBox (logo-x stays 16)', () => {
    const out = html(<LogoX />);
    expect(out).toContain('viewBox="0 0 16 16"');
    expect(out).toContain('width="24"');
  });

  it('still renders and sizes the custom Spinner', () => {
    const out = html(<Spinner />);
    expect(out).toContain('width="24"');
    expect(out).toContain('viewBox="0 0 512 512"');
  });

  it('passes arbitrary svg props through (accessibility attrs)', () => {
    const out = html(<Heart aria-hidden role="img" />);
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain('role="img"');
  });

  it('keeps the currentColor fill contract', () => {
    expect(html(<Heart />)).toContain('fill="currentColor"');
  });
});
