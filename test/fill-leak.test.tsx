import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  BinocularsOutline,
  WifiOutline,
  ServerOutline,
  ArrowDownLeftBoxOutline,
} from '../icons';

// These outline icons had svg fill="none" plus shapes with no own fill, so a
// consumer-passed `fill` prop leaked into (flooded) every shape. Each shape now
// pins fill="none". Color customization is unaffected: outline icons recolor via
// the currentColor STROKE, which this fix does not touch.
const icons = { BinocularsOutline, WifiOutline, ServerOutline, ArrowDownLeftBoxOutline };

describe('outline icons: fill-leak fix', () => {
  for (const [name, Icon] of Object.entries(icons)) {
    it(`${name} pins fill:none so a fill prop cannot flood it`, () => {
      expect(renderToStaticMarkup(<Icon fill="red" />)).toContain('fill="none"');
    });
  }

  it('still recolors via the currentColor stroke', () => {
    expect(renderToStaticMarkup(<BinocularsOutline />)).toContain('stroke="currentColor"');
  });
});
