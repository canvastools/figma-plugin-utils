---
paths:
  - 'src/**/*.ts'
  - '*.md'
  - '.claude/**/*.md'
---

# Language

These conventions apply to each JSDoc in `src`, to `README.md`, to each file in `docs`, `CHANGELOG.md` and to each file in `.claude`.

The language is English in the style of ASD-STE100 (Simplified Technical English), with American spelling.
The American spelling also applies to each comment in the code.

## Words

- Use one word for one concept. Do not use a synonym.
- Use a word in one part of speech and in one meaning: `close` is the verb, not "near".
- Use a technical name when it is in one of these categories:
  - a name from the code: a helper, a class, a type, a property, a value, a file;
  - a term of the platform: TypeScript, Figma, the Plugin API, the node types of Figma.
- Use a technical verb when the platform defines the action: `import`, `export`, `return`, `throw`, `resolve`, `walk`.

## Sentences

- Write a maximum of 20 words in a sentence of an instruction.
- Write a maximum of 25 words in a sentence of a description.
- Write one action in a sentence of an instruction.
- Write one thought in a sentence.
- Write a maximum of 2 sentences in an instruction.
- Write a maximum of 6 sentences in a paragraph.

## Grammar

- Use the simple tenses only: present, past, future.
- Do not use the perfect tenses or the progressive tenses.
- Do not use `would`, `could`, `should` or `might`.
- Start an instruction with an action verb in the imperative: `Use`, `Set`, `Add`, `Put`, `Remove`, `Do not`.
- Write the reason of an instruction as its second sentence, when a reason is necessary.
- Use the active voice in an instruction.
- Use the passive voice only in a description, and only when the agent is not known.
- Use the articles (`the`, `a`) where the grammar permits them.
- Do not use a word that ends in `-ing` as a verb. A noun or a technical name can end in `-ing`: `padding`, `meaning`.

## Layout

- Write a description as a paragraph.
- Write the instructions as a list. Each item starts with an action verb.
- Write a set of facts as a list when each fact stands alone. The limits of a description apply to each item.
- Write a warning before the instruction that it applies to. Start it with `Caution:` and write it as a command.
- Write a complex list of values as a vertical list.
- Write a name from the code as code: `` `getPageOfNode` ``, `` `PageNode` ``, `` `null` ``.
