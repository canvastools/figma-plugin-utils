/**
 * Reads the sections of CHANGELOG.md. The scripts of the release share it.
 *
 * A section starts at a heading of level 2 or 3 and runs until the next one:
 * - `### Unpublished`: the changes that no version contains yet;
 * - `### Version 2.0.0` or `### 1.3.3 - 18 July 2026`: the changes of one version.
 */
import { readFileSync, writeFileSync } from 'node:fs'

export const UNPUBLISHED = '### Unpublished'

const file = new URL('../CHANGELOG.md', import.meta.url)

export const readChangelogLines = () => readFileSync(file, 'utf8').split('\n')

export const writeChangelogLines = (lines) => writeFileSync(file, lines.join('\n'))

const isHeading = (line) => /^#{2,3}\s/.test(line)

/** The version of a version heading, or `null`. */
const headingVersion = (line) => {
  const match = /^#{2,3}\s+(?:Version\s+)?v?(\d+\.\d+\.\d+[\w.-]*)/.exec(line)

  return match ? match[1] : null
}

const isUnpublishedHeading = (line) => /^#{2,3}\s+Unpublished\s*$/i.test(line)

/** The index of the heading and the trimmed body of a section. `null` when there is no such section. */
const findSection = (lines, matches) => {
  const start = lines.findIndex(matches)
  if (start === -1) return null

  const rest = lines.slice(start + 1)
  const end = rest.findIndex(isHeading)

  return { start, body: (end === -1 ? rest : rest.slice(0, end)).join('\n').trim() }
}

export const findVersionSection = (lines, version) => findSection(lines, (line) => headingVersion(line) === version)

export const findUnpublishedSection = (lines) => findSection(lines, isUnpublishedHeading)
