#!/usr/bin/env node
// @ts-check
import { parseArgs } from 'node:util';
import { addIcons } from '../src/cli/add.js';
import { readConfig, writeConfig, CONFIG_NAME } from '../src/cli/config.js';
import { resolveTargetDir } from '../src/cli/resolve-dir.js';
import { listIconNames } from '../src/cli/paths.js';
import { suggest } from '../src/cli/names.js';

const HELP = `@seira-icons/ionicons — copy Ionicons React components into your project.

Usage:
  npx @seira-icons/ionicons add <names...> [options]

Names use the icon's kebab filename. Filled = bare name:
  heart (filled), heart-outline, heart-sharp

Options:
  --dir <path>       Target directory (default: src/components/icons or components/icons)
  --overwrite        Replace existing files (default: skip)
  --allow-outside    Permit a target directory outside the project
  --no-barrel        Do not generate/update index.ts (barrel)
  -h, --help         Show this help

Browse names: https://ionic.io/ionicons  (TypeScript projects; requires jsx: "react-jsx")`;

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      dir: { type: 'string' },
      overwrite: { type: 'boolean', default: false },
      'allow-outside': { type: 'boolean', default: false },
      'no-barrel': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  const [cmd, ...names] = positionals;

  if (values.help || !cmd) {
    process.stdout.write(`${HELP}\n`);
    return 0;
  }
  if (cmd !== 'add') {
    process.stderr.write(`Unknown command: ${cmd}\n\n${HELP}\n`);
    return 1;
  }
  if (names.length === 0) {
    process.stderr.write(`No icon names given.\n\n${HELP}\n`);
    return 1;
  }

  const cwd = process.cwd();
  const config = readConfig(cwd);
  const noBarrel = Boolean(values['no-barrel']);
  const barrelEnabled = !noBarrel && config?.barrel !== false;
  const { dir, persist, source } = resolveTargetDir({ flagDir: values.dir, cwd, config });

  let report;
  try {
    report = addIcons({
      names,
      dir,
      cwd,
      overwrite: Boolean(values.overwrite),
      allowOutside: Boolean(values['allow-outside']),
      barrel: barrelEnabled,
    });
  } catch (err) {
    process.stderr.write(`Error: ${/** @type {Error} */ (err).message}\n`);
    return 1;
  }

  if (report.results.length > 0) {
    const persistBarrelOff = noBarrel && config?.barrel !== false;
    if (persist || persistBarrelOff) {
      /** @type {{directory: string, barrel?: boolean}} */
      const toSave = { directory: dir };
      const barrelToSave = noBarrel ? false : config?.barrel;
      if (typeof barrelToSave === 'boolean') toSave.barrel = barrelToSave;
      writeConfig(cwd, toSave);
      process.stdout.write(`Icons → ${dir} (saved to ${CONFIG_NAME}; override with --dir)\n`);
    } else {
      process.stdout.write(`Icons → ${dir} (source: ${source})\n`);
    }
  }

  for (const [name, status] of report.shared) {
    if (status === 'written') process.stdout.write(`  + ${name} (shared)\n`);
  }
  for (const r of report.results) {
    if (r.status === 'written') process.stdout.write(`  + ${r.name}.tsx\n`);
    else if (r.status === 'skipped-identical') process.stdout.write(`  = ${r.name}.tsx (already up to date)\n`);
    else if (r.status === 'conflict') {
      process.stdout.write(`  ! ${r.name}.tsx exists and differs — re-run with --overwrite to update\n`);
    }
    if (r.isLogo && r.status === 'written') {
      process.stdout.write(
        `    trademark: ${r.name} is a brand mark — MIT covers the artwork, not the mark (see TRADEMARKS.md)\n`,
      );
    }
  }

  if (report.barrel) {
    const b = report.barrel;
    if (b.status === 'written') process.stdout.write(`  + index.ts (barrel, ${b.count} exports)\n`);
    else if (b.status === 'skipped-identical') process.stdout.write(`  = index.ts (barrel, up to date)\n`);
    else if (b.status === 'skipped-unmanaged') {
      process.stdout.write(`  ! index.ts not managed by seira-icons — left unchanged (pass --no-barrel to silence)\n`);
    }
  }

  let exit = 0;
  if (report.unknown.length) {
    exit = 1;
    const all = listIconNames();
    for (const u of report.unknown) {
      const near = suggest(u, all);
      const hint = near.length ? ` — did you mean: ${near.join(', ')}?` : '';
      process.stderr.write(`  ? unknown '${u}'${hint}\n`);
    }
  }
  return exit;
}

process.exit(main());
