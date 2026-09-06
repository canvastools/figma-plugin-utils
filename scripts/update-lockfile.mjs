/**
 * Regenerates package-lock.json for CI.
 *
 * This package lives inside a pnpm workspace whose node_modules and lockfile
 * sit one directory above the git repository. Running `npm install
 * --package-lock-only` here resolves every dependency to a symlink in that
 * parent store and writes paths like `../node_modules/.pnpm/...` — a lockfile
 * that installs nothing on a CI runner while still exiting 0.
 *
 * So the lockfile is built in a temporary directory outside the workspace,
 * where npm has no choice but to resolve against the registry, and copied back.
 *
 * Run this after changing anything in `dependencies` / `devDependencies`.
 * A plain version bump does not need it.
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const scratch = mkdtempSync(join(tmpdir(), 'figma-plugin-utils-lock-'))

try {
  copyFileSync(join(root, 'package.json'), join(scratch, 'package.json'))

  execFileSync('npm', ['install', '--package-lock-only', '--ignore-scripts'], {
    cwd: scratch,
    stdio: 'inherit',
  })

  const lockfile = join(scratch, 'package-lock.json')
  const { packages } = JSON.parse(readFileSync(lockfile, 'utf8'))
  const escaped = Object.keys(packages).filter((path) => path.startsWith('..'))

  if (escaped.length > 0) {
    throw new Error(
      `The generated lockfile still points outside its own tree (${escaped.length} entries, e.g. ${escaped[0]}). ` +
        'npm resolved against the workspace store instead of the registry.',
    )
  }

  copyFileSync(lockfile, join(root, 'package-lock.json'))
  console.log(`\npackage-lock.json updated — ${Object.keys(packages).length - 1} packages.`)
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
