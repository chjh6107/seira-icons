// @ts-check
import { packageFile } from './paths.js';

// Slim, SPDX-first header. Keeps the copyright notice MIT requires + a pointer
// to the co-located full license; drops marketing prose/URL. IONICONS-LICENSE
// carries the full permission notice.
const ICON_BASE =
  '/*! SPDX-License-Identifier: MIT | (c) 2015-present Ionic (Ionicons) — see ./IONICONS-LICENSE';

/** @param {{isLogo?: boolean}} [opts] @returns {string} */
export function iconHeader({ isLogo = false } = {}) {
  if (!isLogo) return `${ICON_BASE} */`;
  return (
    `${ICON_BASE}\n` +
    ' * Trademark: brand logos belong to their owners; MIT covers the artwork, not the mark. ' +
    'See ./TRADEMARKS.md */'
  );
}

/** @returns {string} — header for components original to this project (not Ionicons) */
export function originalHeader() {
  return '/*! SPDX-License-Identifier: MIT | (c) 2026 seira-icons (original component, not part of Ionicons) */';
}

/** @returns {string} */
export function typesHeader() {
  return '/*! SPDX-License-Identifier: MIT | (c) 2026 seira-icons */';
}

/** @returns {string} — single source: the package's shipped THIRD_PARTY_LICENSES */
export function ioniconsLicenseText() {
  return packageFile('THIRD_PARTY_LICENSES');
}

export const TRADEMARKS_TEXT = `# Trademarks

This directory may include brand logo icons (\`logo-*\`) derived from Ionicons.

- Each brand name and logo is a trademark of its respective owner.
- The MIT license covers the SVG **artwork**, not the trademark. No trademark
  rights are granted.
- Inclusion does not imply affiliation with or endorsement by any brand.
- You are responsible for following each brand's usage guidelines.

## Removal requests

Brand owners who want a logo removed: open an issue labeled
\`trademark-removal\` at https://github.com/chjh6107/seira-icons/issues.
`;
