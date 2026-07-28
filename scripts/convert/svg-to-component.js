// @ts-check
import { transform } from '@svgr/core';

/**
 * kebab-case filename → PascalCase component name.
 * `arrow-back` → `ArrowBack`, `logo-react` → `LogoReact`.
 * @param {string} name
 * @returns {string}
 */
export function toPascalCase(name) {
  return name.replace(/(^|-)([a-z0-9])/g, (_, _sep, c) => c.toUpperCase());
}

// Ionicons draw in solid black (#000 / #000000). We map that to `currentColor`
// so the rendered icon inherits the surrounding text color. This also covers
// colors expressed inside inline `style="stroke:#000"`, which SVGO's
// convertColors plugin leaves untouched. The `(?<!\()` guard avoids rewriting a
// paint reference such as `url(#000)` (an id that happens to be `000`).
const BLACK = /(?<!\()#0{3}(?:0{3})?\b/gi;

/** @param {string} svg @returns {string} the root `<svg …>` opening tag */
function rootTag(svg) {
  const m = svg.match(/<svg\b[^>]*>/);
  if (!m) throw new Error('input is not an <svg> document');
  return m[0];
}

/** @param {string} svg @returns {string} */
function extractViewBox(svg) {
  const m = rootTag(svg).match(/\bviewBox\s*=\s*["']([^"']*)["']/);
  // The template owns the viewBox, so we must know it. Guessing a size silently
  // mis-scales icons (e.g. logo-x is 16×16, not 512×512), so fail loudly.
  if (!m) throw new Error('source <svg> has no viewBox; cannot determine canvas size');
  return m[1];
}

/**
 * The root fill, if the source declares one (e.g. outline icons use
 * `fill="none"`). Returned so the template can preserve it instead of forcing
 * `currentColor` onto icons that must stay unfilled.
 * @param {string} svg @returns {string | null}
 */
function extractRootFill(svg) {
  const m = rootTag(svg).match(/\bfill\s*=\s*["']([^"']*)["']/);
  return m ? m[1] : null;
}

// Strip the attributes the template re-declares (width/height/viewBox/fill) plus
// the presentational `class` from the root <svg>, so they don't appear twice or
// fix the attribute order to whatever the source happened to use.
/** @param {string} svg @returns {string} */
function stripRootAttrs(svg) {
  return svg.replace(/<svg\b[^>]*>/, (tag) =>
    tag.replace(/\s+(?:width|height|viewBox|fill|class)\s*=\s*["'][^"']*["']/g, ''),
  );
}

/** @type {NonNullable<import('@svgr/core').Config['template']>} */
const template = (vars, { tpl }) =>
  tpl`
import type { IconProps } from './types';
const ${vars.componentName} = ({ size = 24, ...props }: IconProps) => (
  ${vars.jsx}
);
export default ${vars.componentName};
`;

/**
 * Convert a raw Ionicons SVG into a React component identical to the ones
 * committed under `icons/`.
 * @param {string} source raw SVG markup
 * @param {{ name: string }} opts kebab-case icon name (filename without `.svg`)
 * @returns {Promise<string>} the `.tsx` component source
 */
export async function svgToComponent(source, { name }) {
  const viewBox = extractViewBox(source);
  const sourceFill = extractRootFill(source);
  const prepared = stripRootAttrs(source).replace(BLACK, 'currentColor');

  // Root <svg> attribute order, matching the committed icons:
  //  - source declares a fill (e.g. `none`): keep it, before viewBox.
  //  - source declares none: append an injected `currentColor`, after viewBox.
  const svgProps =
    sourceFill == null
      ? { width: '{size}', height: '{size}', viewBox, fill: 'currentColor' }
      : {
          width: '{size}',
          height: '{size}',
          fill: sourceFill.replace(BLACK, 'currentColor'),
          viewBox,
        };

  return transform(
    prepared,
    {
      plugins: [
        '@svgr/plugin-svgo',
        '@svgr/plugin-jsx',
        '@svgr/plugin-prettier',
      ],
      typescript: true,
      expandProps: 'end',
      svgProps,
      svgoConfig: {
        plugins: [
          { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
        ],
      },
      prettierConfig: { singleQuote: true, jsxSingleQuote: true },
      template,
    },
    { componentName: toPascalCase(name) },
  );
}
