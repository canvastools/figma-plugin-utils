/**
 * Prints the CHANGELOG section for one version, for use as GitHub Release notes.
 * Fails when the version has no section or the section is empty, so a release
 * never goes out without notes. The release workflow runs it after the build.
 */
import { findVersionSection, readChangelogLines } from './changelog.mjs'

const version = process.argv[2]

if (!version) {
  console.error('usage: node scripts/changelog-section.mjs <version>')
  process.exit(1)
}

const section = findVersionSection(readChangelogLines(), version)

if (!section) {
  console.error(`no section for version ${version}. Run npm run version:bump to rename "### Unpublished".`)
  process.exit(1)
}

if (!section.body) {
  console.error(`the section for version ${version} is empty. Write the changes under it.`)
  process.exit(1)
}

console.log(section.body)
