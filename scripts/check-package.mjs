/**
 * Checks the built package before a release. `npm run release:check` runs it after the build. CI runs it after the build too.
 *
 * It fails when:
 * - a file of `exports` does not exist;
 * - a JavaScript file of `exports` fails to import, for example a module that the build left out;
 * - an entry of `files` does not exist;
 * - `npm pack` leaves out a file of `exports`, or puts in a source file, a story, a test or a fixture.
 *
 * A dependency with `workspace:` is a warning: npm publishes the protocol as it is, and a project cannot install it.
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

/** The files that a package never ships. */
const FORBIDDEN = [/^src\//, /^fixtures\//, /^\.storybook\//, /^scripts\//, /\.stories\.[jt]sx?$/, /\.test\.[jt]sx?$/]

/** Each target of `exports` with its condition: `import`, `types`, or `default` for a plain string. */
const exportTargets = (value, condition = 'default') => {
  if (typeof value === 'string') return [{ condition, file: value.replace(/^\.\//, '') }]
  if (value === null || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, inner]) => exportTargets(inner, key.startsWith('.') ? condition : key))
}

const errors = []
const warnings = []

const targets = exportTargets(pkg.exports ?? {}).filter(({ file }) => file !== 'package.json')

if (targets.length === 0) errors.push('package.json: "exports" has no files.')

for (const { file } of targets) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) errors.push(`exports: ${file} does not exist. Run the build.`)
}

for (const entry of pkg.files ?? []) {
  if (!existsSync(new URL(`../${entry}`, import.meta.url))) errors.push(`files: ${entry} does not exist.`)
}

for (const { condition, file } of targets) {
  if (condition !== 'import' || !existsSync(new URL(`../${file}`, import.meta.url))) continue
  try {
    await import(pathToFileURL(`${root}${file}`).href)
  } catch (error) {
    errors.push(`exports: ${file} fails to import: ${error.message}`)
  }
}

const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }),
)
const packed = new Set(pack.files.map(({ path }) => path))

for (const { file } of targets) {
  // A missing file has its error above.
  if (existsSync(new URL(`../${file}`, import.meta.url)) && !packed.has(file))
    errors.push(`npm pack: ${file} of exports is not in the package. Add its folder to "files".`)
}

const extra = [...packed].filter((file) => FORBIDDEN.some((pattern) => pattern.test(file)))
if (extra.length > 0) errors.push(`npm pack: the package holds files of the source: ${extra.slice(0, 5).join(', ')}.`)

const workspaceDeps = Object.entries({ ...pkg.dependencies, ...pkg.peerDependencies })
  .filter(([, range]) => String(range).startsWith('workspace:'))
  .map(([dependency]) => dependency)

if (workspaceDeps.length > 0) {
  warnings.push(`${workspaceDeps.join(', ')} uses "workspace:". Set a version range from npm before the publication.`)
}

for (const message of warnings) {
  console.warn(process.env.GITHUB_ACTIONS ? `::warning title=Package check::${message}` : `! ${message}`)
}

if (errors.length === 0) {
  console.log(`${pkg.name}@${pkg.version}: ${targets.length} files of exports, ${pack.entryCount} files in the package.`)
  process.exit(0)
}

for (const message of errors) {
  console.error(process.env.GITHUB_ACTIONS ? `::error title=Package check::${message}` : `✗ ${message}`)
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = ['## ❌ Package check failed', '', ...errors.map((message) => `- ${message}`), '']
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'))
}

process.exit(1)
