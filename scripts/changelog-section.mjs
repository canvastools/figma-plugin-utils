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

/**
 * Version headings, whatever shape they take: `### 1.3.3 - 18 July 2026` here,
 * `### Version 2.0.0` in the sibling packages. A section runs until the next
 * one of them.
 */
const headingVersion = (line) => {
  const match = /^#{2,3}\s+(?:Version\s+)?v?(\d+\.\d+\.\d+[\w.-]*)/.exec(line)

  return match ? match[1] : null
}

const start = lines.findIndex((line) => headingVersion(line) === version)

if (start === -1) {
  console.log(`Release ${version}.`)
  process.exit(0)
}

const rest = lines.slice(start + 1)
const end = rest.findIndex((line) => headingVersion(line) !== null)
const body = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim()

console.log(body || `Release ${version}.`)
