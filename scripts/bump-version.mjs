/**
 * Sets the next version in package.json and package-lock.json, and renames the
 * `### Unpublished` section of CHANGELOG.md to `### Version x.y.z`.
 *
 * usage: npm run version:bump -- patch | minor | major | x.y.z
 *
 * It changes nothing when `### Unpublished` does not exist or is empty: a version
 * without changes is an error. It does not commit, tag or publish. CI publishes
 * after the merge to main.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { UNPUBLISHED, findUnpublishedSection, readChangelogLines, writeChangelogLines } from './changelog.mjs'

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-[\w.-]+)?$/

const fileUrl = (file) => new URL(`../${file}`, import.meta.url)
const readJson = (file) => JSON.parse(readFileSync(fileUrl(file), 'utf8'))
const writeJson = (file, data) => writeFileSync(fileUrl(file), `${JSON.stringify(data, null, 2)}\n`)

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const nextVersion = (current, step) => {
  if (SEMVER.test(step)) return step

  const match = SEMVER.exec(current)
  if (!match) fail(`package.json: "${current}" is not a version of the form x.y.z.`)

  const [major, minor, patch] = match.slice(1, 4).map(Number)

  switch (step) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      fail('usage: npm run version:bump -- patch | minor | major | x.y.z')
  }
}

const pkg = readJson('package.json')
const version = nextVersion(pkg.version, process.argv[2])

// The CHANGELOG first: when it fails, the other files stay as they are.
const lines = readChangelogLines()
const unpublished = findUnpublishedSection(lines)

if (!unpublished) fail(`CHANGELOG.md: no "${UNPUBLISHED}" section. Add it at the top with the changes.`)
if (!unpublished.body) fail(`CHANGELOG.md: the "${UNPUBLISHED}" section is empty. Write the changes under it.`)

lines[unpublished.start] = `### Version ${version}`
writeChangelogLines(lines)

pkg.version = version
writeJson('package.json', pkg)

if (existsSync(fileUrl('package-lock.json'))) {
  const lock = readJson('package-lock.json')
  lock.version = version
  if (lock.packages?.['']) lock.packages[''].version = version
  writeJson('package-lock.json', lock)
}

console.log(`Version ${version}. CHANGELOG.md: "${UNPUBLISHED}" is now "### Version ${version}".`)
