import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Spinner } from '../icons';

describe('Spinner fill-leak fix', () => {
  it('keeps the arc unfilled even when a `fill` prop is passed', () => {
    // Regression: <Spinner fill="red" /> used to flood the open arc into a solid
    // red wedge, because the path inherited the svg-level fill. The path now
    // pins fill:none, so an errant fill prop cannot leak in.
    const out = renderToStaticMarkup(<Spinner fill="red" />);
    expect(out).toContain('fill:none');
  });

  it('renders its stroke via currentColor', () => {
    expect(renderToStaticMarkup(<Spinner />)).toContain('stroke:currentColor');
  });
});
