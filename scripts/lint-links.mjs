// Checks that each relative link and each `@` import in the Markdown files of the package goes to a file that exists.
// Claude Code gives no error for an import that it cannot find, so a moved file silently removes a rule.

import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** The folders that hold no Markdown of the package: dependencies, build output, copies of other branches. */
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'storybook-static', 'worktrees'])

const LINK = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
const IMPORT = /^\s*@(\S+\/\S*)\s*$/

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.name.endsWith('.md')) yield full
  }
}

/** A target that is not a path of this package: a URL, an anchor, a placeholder of a template. */
const isExternal = (target) => /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#') || /[{}<>$]/.test(target)

/**
 * Checks a path through `node_modules/<package>/` that does not exist, for example in a template. The path is checked
 * in the package itself (its own name) or in the `node_modules` of the root.
 * Returns `found`, `missing`, `not installed` when the package is not in the `node_modules` of the root, or `null`.
 */
const resolveInPackage = (root, ownName, resolved) => {
  const index = resolved.lastIndexOf(`${path.sep}node_modules${path.sep}`)
  if (index === -1) return null
  const parts = resolved.slice(index + '/node_modules/'.length).split(path.sep)
  const nameLength = parts[0].startsWith('@') ? 2 : 1
  const name = parts.slice(0, nameLength).join('/')
  const rest = parts.slice(nameLength)
  const base = name === ownName ? root : path.join(root, 'node_modules', ...name.split('/'))
  if (!existsSync(base)) return 'not installed'
  return existsSync(path.join(base, ...rest)) ? 'found' : 'missing'
}

/**
 * Finds each broken link and each broken `@` import in the Markdown files under `root`.
 * The code blocks, the code spans and the frontmatter are not read.
 */
export const findBrokenLinks = async (root) => {
  let ownName = ''
  try {
    ownName = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).name ?? ''
  } catch {
    // A folder with no package.json has no own name.
  }

  const problems = []
  const skipped = []
  let fileCount = 0
  for await (const file of walk(root)) {
    fileCount += 1
    const lines = (await readFile(file, 'utf8')).split('\n')
    let inFence = false
    let inFrontmatter = false

    lines.forEach((raw, index) => {
      if (index === 0 && raw.trim() === '---') {
        inFrontmatter = true
        return
      }
      if (inFrontmatter) {
        if (raw.trim() === '---') inFrontmatter = false
        return
      }
      if (/^\s*(```|~~~)/.test(raw)) {
        inFence = !inFence
        return
      }
      if (inFence) return

      const line = raw.replace(/(`+)[\s\S]*?\1/g, '')
      const targets = [...line.matchAll(LINK)].map((match) => ({ kind: 'link', target: match[1] }))
      const imported = line.match(IMPORT)
      if (imported) targets.push({ kind: 'import', target: imported[1] })

      for (const { kind, target } of targets) {
        if (isExternal(target)) continue
        const clean = decodeURI(target.replace(/[#?].*$/, ''))
        if (!clean) continue
        const resolved = clean.startsWith('~/')
          ? path.join(os.homedir(), clean.slice(2))
          : path.resolve(path.dirname(file), clean)
        if (existsSync(resolved)) continue
        const inPackage = resolveInPackage(root, ownName, resolved)
        if (inPackage === 'found') continue
        const place = { file: path.relative(root, file), line: index + 1, kind, target }
        if (inPackage === 'not installed') skipped.push(place)
        else problems.push(place)
      }
    })
  }
  return { problems, skipped, fileCount }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const { problems, skipped, fileCount } = await findBrokenLinks(process.cwd())
  for (const { file, line, kind, target } of problems) console.error(`${file}:${line}  broken ${kind}: ${target}`)
  for (const { file, line, target } of skipped)
    console.warn(`${file}:${line}  not checked, the package is not installed: ${target}`)
  if (problems.length) {
    console.error(`\n${problems.length} broken link${problems.length === 1 ? '' : 's'}.`)
    process.exit(1)
  }
  console.log(`Links: ${fileCount} Markdown files, no broken links.`)
}
