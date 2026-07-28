import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ICON_BANNER } from '../scripts/convert/svg-to-component.js';
import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as icons from '../icons';
import type { IconProps } from '../icons';

// The source SVGs these components were converted from are not in this repo, so a
// damaged icon cannot be regenerated — it can only be restored from git. These tests
// exist to make that damage loud: a bulk overwrite that mangles path data or drops
// icons fails here instead of shipping.

const ICONS_DIR = fileURLToPath(new URL('../icons', import.meta.url));

type Icon = ComponentType<IconProps>;

const exported: [string, Icon][] = Object.entries(icons)
  .filter((entry): entry is [string, Icon] => typeof entry[1] === 'function')
  .sort(([a], [b]) => (a < b ? -1 : 1));

/**
 * Render an icon and drop the `width`/`height` of the root `<svg>` only.
 *
 * Sizing is a prop contract covered by size.test.tsx; `<rect>` keeps its own
 * width/height because those are geometry.
 */
const geometryOf = (Icon: Icon) =>
  renderToStaticMarkup(<Icon />).replace(/^<svg[^>]*>/, (open) =>
    open.replace(/ (?:width|height)="[^"]*"/g, ''),
  );

const fingerprint = (markup: string) =>
  createHash('sha256').update(markup).digest('hex').slice(0, 16);

describe('icon set integrity', () => {
  it('exports every .tsx under icons/ — no orphaned files', () => {
    const files = readdirSync(ICONS_DIR).filter(
      (f) => f.endsWith('.tsx') && f !== 'index.tsx',
    );

    // Both sides are gathered independently: the filesystem and the barrel. An icon
    // added without a barrel entry, or a file lost in a bulk write, breaks the match.
    expect(exported.length).toBe(files.length);
  });

  it('marks every icon file as converter output', () => {
    // A file without the banner reads as hand-written source, which invites the
    // one edit that cannot be undone. New icons must arrive through convert:icons.
    const unmarked = readdirSync(ICONS_DIR)
      .filter((f) => f.endsWith('.tsx'))
      .filter((f) => !readFileSync(join(ICONS_DIR, f), 'utf8').startsWith(ICON_BANNER));

    expect(unmarked).toEqual([]);
  });

  it('renders every exported icon without throwing', () => {
    const broken = exported
      .filter(([, Icon]) => {
        try {
          return !geometryOf(Icon).startsWith('<svg');
        } catch {
          return true;
        }
      })
      .map(([name]) => name);

    expect(broken).toEqual([]);
  });
});

describe('icon geometry', () => {
  it('keeps every icon’s rendered shape byte-identical', () => {
    const manifest = exported
      .map(([name, Icon]) => `${name} ${fingerprint(geometryOf(Icon))}`)
      .join('\n');

    expect(manifest).toMatchSnapshot();
  });

  it('preserves each icon’s coordinate space', () => {
    const viewBoxes = exported
      .map(([name, Icon]) => {
        const [, viewBox] = /viewBox="([^"]*)"/.exec(geometryOf(Icon)) ?? [];
        return `${name} ${viewBox ?? 'MISSING'}`;
      })
      .join('\n');

    expect(viewBoxes).toMatchSnapshot();
  });
});
