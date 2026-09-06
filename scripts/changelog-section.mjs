/**
 * Prints the CHANGELOG section for one version, for use as GitHub Release notes.
 * Falls back to a one-line note when the version has no section yet, so a
 * forgotten changelog entry never fails the release.
 */
import { readFileSync } from 'node:fs'

const version = process.argv[2]

if (!version) {
  console.error('usage: node scripts/changelog-section.mjs <version>')
  process.exit(1)
}

const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8')
const lines = changelog.split('\n')

// Headings look like `### Version 2.0.0`; the section runs until the next
// heading of the same level.
const isHeading = (line) => /^#{1,3}\s+Version\s/.test(line)
const start = lines.findIndex((line) => isHeading(line) && line.includes(version))

if (start === -1) {
  console.log(`Release ${version}.`)
  process.exit(0)
}

const rest = lines.slice(start + 1)
const end = rest.findIndex(isHeading)
const body = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim()

console.log(body || `Release ${version}.`)
