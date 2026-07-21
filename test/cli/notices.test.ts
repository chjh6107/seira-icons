import { describe, it, expect } from 'vitest';
import {
  iconHeader,
  typesHeader,
  originalHeader,
  ioniconsLicenseText,
  TRADEMARKS_TEXT,
} from '../../src/cli/notices.js';

describe('notices', () => {
  it('non-logo header is a slim single-line SPDX block comment that keeps the Ionic copyright', () => {
    const h = iconHeader({ isLogo: false });
    expect(h.startsWith('/*!')).toBe(true);
    expect(h.endsWith('*/')).toBe(true);
    expect(h).toContain('SPDX-License-Identifier: MIT');
    expect(h).toContain('(c) 2015-present Ionic'); // MIT requires the copyright notice
    expect(h).toContain('./IONICONS-LICENSE');
    expect(h).not.toContain('\n');
    // slimmed: no marketing prose / URL
    expect(h).not.toContain('ionic.io');
    expect(h).not.toContain('ported by');
  });
  it('logo header adds a trademark line referencing TRADEMARKS.md', () => {
    const h = iconHeader({ isLogo: true });
    expect(h).toContain('Trademark');
    expect(h).toContain('./TRADEMARKS.md');
    expect(h).toContain('\n');
  });
  it('types header is a slim SPDX one-liner with a non-personal copyright holder', () => {
    const h = typesHeader();
    expect(h).toContain('SPDX-License-Identifier: MIT');
    expect(h).toContain('seira-icons');
  });
  it('original (spinner) header attributes the project, not Ionicons', () => {
    const h = originalHeader();
    expect(h).toContain('original component, not part of Ionicons');
    expect(h).toContain('seira-icons');
  });
  it('ioniconsLicenseText carries the MIT permission notice', () => {
    const t = ioniconsLicenseText();
    expect(t).toContain('Permission is hereby granted');
    expect(t).toContain('THE SOFTWARE IS PROVIDED "AS IS"');
  });
  it('trademarks text has a removal channel but no personal email', () => {
    expect(TRADEMARKS_TEXT.toLowerCase()).toContain('removal');
    expect(TRADEMARKS_TEXT).not.toContain('@gmail.com');
  });
  it('no notices output leaks a personal email or personal-name copyright', () => {
    const all = [
      iconHeader({ isLogo: false }),
      iconHeader({ isLogo: true }),
      typesHeader(),
      originalHeader(),
      TRADEMARKS_TEXT,
    ].join('\n');
    // Generic patterns — this test embeds no personal data of its own.
    expect(all).not.toMatch(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i); // no email address
    expect(all).not.toMatch(/\(c\)\s*\d{4}\s+[A-Z][a-z]+\s+[A-Z][a-z]+/); // no "(c) YYYY Firstname Lastname"
    expect(all).toContain('seira-icons'); // project holder, not a person
  });
});
