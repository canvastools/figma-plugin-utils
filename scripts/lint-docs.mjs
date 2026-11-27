// Checks the language of every JSDoc block in `src` (stories and tests excluded) and of every Markdown file in `.claude`
// and `docs` against `.claude/rules/language.md`. The words come from the table `## Glossary` of `.claude/CLAUDE.md`.
// It covers what a script can decide; the meaning of a sentence stays with the writer.

import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/* This file. The spelling check skips it: it holds the British words */
const SELF = fileURLToPath(import.meta.url)
const ROOT = fileURLToPath(new URL('..', import.meta.url))

/* The folders with the JSDoc and the Markdown files that the check reads, when they exist */
const SOURCE_ROOT = 'src'
const MARKDOWN_ROOTS = ['.claude', 'docs']

/* The folders that hold no text of the project: dependencies, build output, copies of other branches */
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'storybook-static', 'worktrees'])

const MAX_WORDS_INSTRUCTION = 20
const MAX_WORDS_DESCRIPTION = 25
const MAX_SENTENCES_INSTRUCTION = 2
const MAX_SENTENCES_PARAGRAPH = 6

/* The verbs an instruction can start with. `Do not` is followed by one of them */
const ACTION_VERBS = [
  'add',
  'ask',
  'break',
  'call',
  'change',
  'check',
  'export',
  'find',
  'fix',
  'follow',
  'give',
  'import',
  'install',
  'keep',
  'list',
  'make',
  'map',
  'merge',
  'name',
  'open',
  'pass',
  'put',
  'read',
  'refer',
  'remove',
  'render',
  'restore',
  'return',
  'run',
  'search',
  'select',
  'set',
  'show',
  'split',
  'start',
  'stop',
  'tell',
  'test',
  'use',
  'wrap',
  'write',
]

/* Technical names, plain nouns and prepositions that end in `-ing` and are not verb forms */
const ING_ALLOWED = [
  'binding',
  'drawing',
  'during',
  'heading',
  'meaning',
  'nothing',
  'padding',
  'setting',
  'sibling',
  'ring',
  'spacing',
  'spelling',
  'string',
  'thing',
  'tracking',
  'warning',
]

/* A British spelling and the American spelling to use. The spelling check skips this file: it holds the British words */
const SPELLING = {
  colour: 'color',
  behaviour: 'behavior',
  centre: 'center',
  favour: 'favor',
  grey: 'gray',
  licence: 'license',
  initialise: 'initialize',
  normalise: 'normalize',
  customise: 'customize',
  organise: 'organize',
  optimise: 'optimize',
  recognise: 'recognize',
}

const MODALS = ['would', 'could', 'should', 'might']

const INSTRUCTION_START = new RegExp(`^(caution: )?(do not )?(${ACTION_VERBS.join('|')})\\b`, 'i')

/* Each file under `dir` that `accept` takes. A link is not followed: a skill of a project can link into `node_modules` */
async function* walk(dir, accept) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.isSymbolicLink()) continue
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(file, accept)
    else if (accept(entry.name)) yield file
  }
}

const isSource = (name) => /\.tsx?$/.test(name) && !/\.(stories|test)\.tsx?$/.test(name)
const isMarkdown = (name) => name.endsWith('.md')

const words = (sentence) => sentence.split(/\s+/).filter((word) => /[A-Za-z0-9]/.test(word))

const sentences = (text) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

/**
 * Reads the glossary of the project: the table under `## Glossary` in `.claude/CLAUDE.md`.
 * The first column is the word to use. The column `Do not use` holds the words that it replaces, separated by commas.
 * An empty map when the file or the table does not exist: the check of the words is then skipped.
 */
async function readGlossary(root) {
  const synonyms = new Map()
  const file = path.join(root, '.claude', 'CLAUDE.md')
  if (!existsSync(file)) return synonyms

  const lines = (await readFile(file, 'utf8')).split('\n')
  const start = lines.findIndex((line) => /^##\s+Glossary\s*$/i.test(line))
  if (start === -1) return synonyms

  const cells = (line) =>
    line
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim())
  const rows = lines.slice(start + 1).filter((line) => line.trim().startsWith('|'))
  if (rows.length === 0) return synonyms

  const banned = cells(rows[0]).findIndex((cell) => /^do not use$/i.test(cell))
  if (banned === -1) return synonyms

  for (const row of rows.slice(1)) {
    const columns = cells(row)
    if (/^-+$/.test(columns[0])) continue
    const word = columns[0].replace(/`/g, '')
    for (const synonym of (columns[banned] ?? '').split(',')) {
      const name = synonym.replace(/`/g, '').trim().toLowerCase()
      if (name) synonyms.set(name, word)
    }
  }
  return synonyms
}

/* Splits the body of a JSDoc block into paragraphs and list items. The code of `@example` is dropped */
function toJsdocBlocks(body, line) {
  const blocks = []
  let current = null
  let inExample = false
  let inFence = false

  const close = () => {
    if (current) blocks.push(current)
    current = null
  }

  for (const raw of body.split('\n')) {
    const text = raw.replace(/^\s*\*? ?/, '')

    if (text.trim().startsWith('```')) {
      inFence = !inFence
      close()
      continue
    }
    if (inFence) continue

    const tag = text.match(/^@(\w+)\s*(.*)$/)
    if (tag) {
      close()
      inExample = tag[1] === 'example'
      if (!inExample && tag[2]) current = { kind: 'description', text: tag[2], line }
      continue
    }
    if (inExample) continue

    if (!text.trim()) {
      close()
    } else if (/^- /.test(text)) {
      // A list item is an instruction only when it starts like one: a list can also hold facts, for example `name`: meaning
      close()
      const item = text.slice(2)
      current = { kind: INSTRUCTION_START.test(item) ? 'instruction' : 'description', text: item, line }
    } else if (current) {
      current.text += ' ' + text.trim()
    } else {
      current = { kind: 'description', text: text.trim(), line }
    }
  }
  close()
  return blocks
}

/**
 * Splits a Markdown file into paragraphs and list items, each with its line.
 * The frontmatter, the code blocks, the tables and the titles are dropped.
 */
function toMarkdownBlocks(source) {
  const blocks = []
  let current = null
  let inFence = false
  let inFrontmatter = false

  const close = () => {
    if (current) blocks.push(current)
    current = null
  }

  source.split('\n').forEach((raw, index) => {
    const line = raw.trim()
    const number = index + 1

    if (line === '---' && (index === 0 || inFrontmatter)) {
      inFrontmatter = !inFrontmatter
      return
    }
    if (inFrontmatter) return

    if (line.startsWith('```')) {
      inFence = !inFence
      close()
      return
    }
    if (inFence) return

    if (!line || line.startsWith('#') || line.startsWith('|') || line.startsWith('@')) return close()

    const item = line.match(/^(?:-|\d+\.)\s+(.*)$/)
    const reason = line.match(/^Why:\s*(.*)$/)
    if (item) {
      close()
      current = { kind: INSTRUCTION_START.test(item[1]) ? 'instruction' : 'description', text: item[1], line: number }
    } else if (reason) {
      close()
      current = { kind: 'description', text: reason[1], line: number }
    } else if (current) {
      current.text += ' ' + line
    } else {
      current = { kind: 'description', text: line, line: number }
    }
  })
  close()
  return blocks
}

function check(block, synonyms) {
  const problems = []
  const isInstruction = block.kind === 'instruction'

  // The target of a link is a path. Code and names are single words that the language rules do not apply to
  const prose = block.text
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/`[^`]*`/g, 'CODE')
    .replace(/\*\*([^*]+)\*\*/g, 'NAME')
  const parts = sentences(prose)

  const maxSentences = isInstruction ? MAX_SENTENCES_INSTRUCTION : MAX_SENTENCES_PARAGRAPH
  if (parts.length > maxSentences) {
    problems.push(
      `${parts.length} sentences in ${isInstruction ? 'an instruction' : 'a paragraph'}, the maximum is ${maxSentences}`,
    )
  }

  const maxWords = isInstruction ? MAX_WORDS_INSTRUCTION : MAX_WORDS_DESCRIPTION
  parts.forEach((sentence, index) => {
    const count = words(sentence).length
    if (count > maxWords) problems.push(`${count} words, the maximum is ${maxWords}: "${sentence}"`)
    if (!isInstruction) return

    // The first sentence is the command. A second sentence can be another command or the reason
    if (index === 0) {
      const start = sentence.toLowerCase().match(/^(caution: )?(do not )?([a-z]+)/)
      if (!start || !ACTION_VERBS.includes(start[3])) problems.push(`start the instruction with an action verb: "${sentence}"`)
    }
    // `open` is an adjective here ("a question is open"), not a participle
    const passive = sentence.match(/\b(?:is|are|be)\s+(?!open\b)\w+(?:ed|en)\b/i)
    if (passive) problems.push(`use the active voice in an instruction: "${passive[0]}"`)
  })

  const lower = prose.toLowerCase()

  for (const word of lower.match(/\b[a-z]+ing\b/g) ?? []) {
    if (!ING_ALLOWED.includes(word)) problems.push(`do not use an -ing form: "${word}"`)
  }
  const perfect = lower.match(/\b(?:has|have|had)\s+(?:been|\w+ed)\b/)
  if (perfect) problems.push(`use a simple tense: "${perfect[0]}"`)
  for (const modal of MODALS) {
    if (new RegExp(`\\b${modal}\\b`).test(lower)) problems.push(`do not use "${modal}"`)
  }
  for (const [word, replacement] of synonyms) {
    if (new RegExp(`(?<![\\w-])${word}s?(?![\\w-])`).test(lower)) problems.push(`use "${replacement}", not "${word}"`)
  }

  return problems
}

const root = ROOT
const rules = '.claude/rules/language.md'
const synonyms = await readGlossary(root)

const problems = []
const report = (file, block) => {
  for (const problem of check(block, synonyms)) problems.push(`${path.relative(root, file)}:${block.line}  ${problem}`)
}
const spelling = (file, source) => {
  if (path.resolve(file) === SELF) return
  source.split('\n').forEach((line, index) => {
    for (const [british, american] of Object.entries(SPELLING)) {
      if (new RegExp(`\\b${british}`, 'i').test(line)) {
        problems.push(`${path.relative(root, file)}:${index + 1}  use the American spelling: "${american}", not "${british}"`)
      }
    }
  })
}

let sourceCount = 0
if (existsSync(path.join(root, SOURCE_ROOT))) {
  for await (const file of walk(path.join(root, SOURCE_ROOT), isSource)) {
    sourceCount += 1
    const source = await readFile(file, 'utf8')
    for (const match of source.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
      const line = source.slice(0, match.index).split('\n').length
      for (const block of toJsdocBlocks(match[1], line)) report(file, block)
    }
    spelling(file, source)
  }
}

let markdownCount = 0
for (const folder of MARKDOWN_ROOTS) {
  if (!existsSync(path.join(root, folder))) continue
  for await (const file of walk(path.join(root, folder), isMarkdown)) {
    markdownCount += 1
    const source = await readFile(file, 'utf8')
    for (const block of toMarkdownBlocks(source)) report(file, block)
    spelling(file, source)
  }
}

const glossary = synonyms.size > 0 ? `${synonyms.size} words of the glossary` : 'no glossary in .claude/CLAUDE.md'
const scope = `${sourceCount} source files, ${markdownCount} Markdown files, ${glossary}`

if (problems.length === 0) {
  console.log(`Language: ${scope}, no problems.`)
  process.exit(0)
}

for (const problem of problems) console.error(problem)
console.error(`\nLanguage: ${problems.length} problems in ${scope}. The rules are in ${rules}.`)
process.exit(1)
