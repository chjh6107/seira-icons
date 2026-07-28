# seira-icons

Unofficial React components ported from the Ionicons set.

## Gotchas

**`icons/*.tsx` cannot be regenerated.** The SVGs they were converted from are
not in this repo — only 12 fixtures under `test/convert/fixtures/`. Editing a
single icon by hand is normal and safe; overwriting the set in bulk has no
recovery path except git. CI refuses a diff over 20 icon files unless a commit
message carries `[bulk-icons]`.

**This working directory is shared by parallel agents.** Do not `git switch` or
`git checkout <branch>` here — it moves the branch pointer under sessions that
are working in the same tree. Use a worktree instead.

## Scripts

The verb states whether the output can be remade:

- `npm run convert:icons <svg-dir> --out <dir>` — needs SVGs this repo does not
  have; irreversible. Requires `--out`, so it never writes over `icons/` directly.
- `npm run generate:barrel` — derives `icons/index.ts` from the files beside it;
  safe to rerun. `-- --check` exits 1 when the barrel is stale.

Everything else is enforced by tests rather than described here: geometry
snapshots, banner presence, and barrel freshness all fail in `npm test` or CI.
