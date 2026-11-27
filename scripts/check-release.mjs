/**
 * Checks that the current commit can be released. CI runs it on each pull
 * request to main and on each push to main, before the build.
 *
 * It fails when:
 * - the version in package.json is not higher than each version on npm;
 * - the version in package-lock.json is not the version in package.json;
 * - CHANGELOG.md has no section for the version, or the section is empty;
 * - CHANGELOG.md has changes under `### Unpublished`: no version contains them.
 *
 * With `--dry-run` each failure is a warning, and the exit code is 0. `release:check` uses it, so it runs
 * before the version bump and goes on to the build. CI runs the check without the flag.
 *
 * In GitHub Actions each failure is also an error annotation and a line in the
 * job summary, so a forgotten version bump is visible on the run page.
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { UNPUBLISHED, findUnpublishedSection, findVersionSection, readChangelogLines } from './changelog.mjs'

const readJson = (file) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?$/

/** Negative when a < b. A prerelease is lower than its release. */
const compareVersions = (a, b) => {
  const [, ...pa] = SEMVER.exec(a)
  const [, ...pb] = SEMVER.exec(b)

  for (let i = 0; i < 3; i++) {
    const diff = Number(pa[i]) - Number(pb[i])
    if (diff !== 0) return diff
  }

  if (pa[3] === pb[3]) return 0
  if (pa[3] === undefined) return 1
  if (pb[3] === undefined) return -1

  return pa[3].localeCompare(pb[3], 'en', { numeric: true })
}

/** All versions of the package on npm. An empty list when the package is not published yet. */
const readPublishedVersions = (name) => {
  try {
    const output = execFileSync('npm', ['view', name, 'versions', '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const versions = JSON.parse(output)

    return Array.isArray(versions) ? versions : [versions]
  } catch (error) {
    if (String(error.stderr).includes('E404')) return []
    throw error
  }
}

const DRY_RUN = process.argv.includes('--dry-run')
const errors = []
const { name, version } = readJson('package.json')

if (!SEMVER.test(version ?? '')) {
  errors.push(`package.json: "${version}" is not a version of the form x.y.z.`)
} else {
  const published = readPublishedVersions(name).filter((item) => SEMVER.test(item))
  const latest = published.sort(compareVersions).at(-1)

  if (latest && compareVersions(version, latest) <= 0) {
    errors.push(
      `package.json: version ${version} is not higher than ${latest}, the highest version on npm. ` +
        'Bump the version: npm run version:bump -- patch | minor | major',
    )
  }
}

if (existsSync(new URL('../package-lock.json', import.meta.url))) {
  const lock = readJson('package-lock.json')
  const lockVersions = new Set([lock.version, lock.packages?.['']?.version])

  if (lockVersions.size !== 1 || !lockVersions.has(version)) {
    errors.push(
      `package-lock.json: version ${[...lockVersions].join(' / ')} is not ${version}. ` +
        'Run npm run version:bump, or npm run lockfile after a dependency change.',
    )
  }
}

const changelog = readChangelogLines()
const section = findVersionSection(changelog, version)

if (!section) {
  errors.push(`CHANGELOG.md: no section for version ${version}. Run npm run version:bump to rename "${UNPUBLISHED}".`)
} else if (!section.body) {
  errors.push(`CHANGELOG.md: the section for version ${version} is empty. Write the changes under it.`)
}

if (findUnpublishedSection(changelog)?.body) {
  errors.push(
    `CHANGELOG.md: "${UNPUBLISHED}" has changes that no version contains. Run npm run version:bump to give them a version.`,
  )
}

if (errors.length === 0) {
  console.log(`${name}@${version} can be released.`)
  process.exit(0)
}

if (DRY_RUN) {
  for (const message of errors) {
    console.warn(process.env.GITHUB_ACTIONS ? `::warning title=Release check::${message}` : `! ${message}`)
  }
  console.log(`${name}@${version}: ${errors.length} problems of the release. A dry run goes on.`)
  process.exit(0)
}

for (const message of errors) {
  console.error(process.env.GITHUB_ACTIONS ? `::error title=Release check::${message}` : `✗ ${message}`)
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = ['## ❌ Release check failed', '', ...errors.map((message) => `- ${message}`), '']
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'))
}

process.exit(1)
