// @ts-check
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { svgToComponent } from './svg-to-component.js';

/**
 * @typedef {{ name: string }} IconResult
 * @typedef {{ written: number, results: IconResult[] }} Report
 */

/**
 * Convert every `.svg` in `inputDir` into a `.tsx` component in `outputDir`.
 * Non-`.svg` files are ignored. The output directory is created if missing.
 * @param {{ inputDir: string, outputDir: string }} opts
 * @returns {Promise<Report>}
 */
export async function generateIcons({ inputDir, outputDir }) {
  const svgs = readdirSync(inputDir)
    .filter((f) => f.endsWith('.svg'))
    .sort();

  mkdirSync(outputDir, { recursive: true });

  /** @type {IconResult[]} */
  const results = [];
  for (const file of svgs) {
    const name = file.replace(/\.svg$/, '');
    try {
      const source = readFileSync(join(inputDir, file), 'utf8');
      const component = await svgToComponent(source, { name });
      writeFileSync(join(outputDir, `${name}.tsx`), component);
    } catch (err) {
      // Name the offending file — in a 1,300+ icon run an anonymous failure is
      // impossible to trace back to a source.
      throw new Error(`Failed to generate ${file}: ${/** @type {Error} */ (err).message}`, {
        cause: err,
      });
    }
    results.push({ name });
  }

  return { written: results.length, results };
}

const HELP = `Generate React icon components from a directory of SVGs.

Usage:
  node scripts/generate/generate-icons.js <input-dir> --out <dir>

Options:
  --out <dir>   Output directory for .tsx components (required)
  -h, --help    Show this help

Each <name>.svg becomes <name>.tsx (PascalCase component, default export),
matching the shape of the components already under icons/. --out is required:
pass an empty scratch dir and diff against icons/ before replacing anything, so
a stale toolchain can never silently clobber the committed set.`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      out: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  const [inputDir] = positionals;
  if (values.help || !inputDir) {
    process.stdout.write(`${HELP}\n`);
    return values.help ? 0 : 1;
  }
  if (!values.out) {
    process.stderr.write(`Missing --out <dir>.\n\n${HELP}\n`);
    return 1;
  }

  const report = await generateIcons({ inputDir, outputDir: values.out });
  process.stdout.write(`Generated ${report.written} component(s) → ${values.out}\n`);
  return 0;
}

// Run as a CLI only when invoked directly (not when imported by tests).
// pathToFileURL matches the percent-encoding of import.meta.url, so paths with
// spaces or Windows drive letters still trip the guard.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    });
}
