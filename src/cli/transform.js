// @ts-check
import { iconHeader, originalHeader, typesHeader } from './notices.js';

const NEEDLE = "from './types'";
const REPLACEMENT = "from './icon.types'";

/**
 * @param {string} source
 * @param {{name: string, isLogo?: boolean, isOriginal?: boolean}} opts
 * @returns {string}
 */
export function transformIcon(source, { name, isLogo = false, isOriginal = false }) {
  const count = source.split(NEEDLE).length - 1;
  if (count !== 1) {
    throw new Error(
      `transformIcon(${name}): expected exactly one \`${NEEDLE}\`, found ${count}. ` +
        'Icon source shape changed; update the transform.',
    );
  }
  const rewritten = source.replace(NEEDLE, REPLACEMENT);
  const header = isOriginal ? originalHeader() : iconHeader({ isLogo });
  return `${header}\n${rewritten}`;
}

/** @param {string} source @returns {string} */
export function transformTypes(source) {
  return `${typesHeader()}\n${source}`;
}

/** @param {string} text @returns {string} */
export function contentWithoutHeader(text) {
  return text.replace(/^\/\*![\s\S]*?\*\/\n?/, '');
}
