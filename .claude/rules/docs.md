---
paths:
  - 'src/**/*.ts'
  - 'README.md'
  - 'docs/**/*.md'
  - 'CHANGELOG.md'
---

# Documentation

The JSDoc is the documentation of a helper. It goes into the `.d.ts` files, so the code that uses the package reads it.
`README.md` is short: what the package is, an example and the list of the files of `docs/`.

The language conventions are in `language.md`.

## What gets a JSDoc

- Each exported helper, class and method.
- Each property of an options type.
- Each property of an exported type, with `/** */`. A comment with `/* */` does not go into the `.d.ts` files.
- A type of options needs no JSDoc of its own. The JSDoc is on each property.

## Helper

The JSDoc of a helper has three sections, in this order:

1. The description: one or more paragraphs, in the limits of `language.md`. It says what the helper gives and when to use it. It says why the helper works this way when a simpler way fails.
2. The instructions: a list. Each item says what to do or what not to do.
3. The examples: one `@example` for each instruction that changes the code. An instruction that shows its code needs no example.

- Write the safe answer of the helper in the description: `false`, `null` or an empty list.
- Start the code of each example with a comment that names its case, when there are two or more.
- Start a paragraph with a bold sentence when the paragraph gives the main reason of the helper.

## The files of `docs`

`docs/` is the documentation for the code that uses the package, next to the JSDoc. It goes into the package.
The reader of `docs/` is a model in a project. It knows the task of the project, not the code of the package.
It must use the package from `docs/` and the JSDoc alone. `docs/usage.md` is the entry, and a project imports it.

- Write in `docs/` a rule that is true for many exports, and the way to put the exports together.
- Write a rule of one export in its JSDoc. Do not repeat a JSDoc in `docs/`.
- Name an export in `docs/` to help the reader find it. Do not copy its fields or its examples.
- Copy a fact of `.claude` to `docs/` only when a project needs it to use the package.
- Do not copy a fact about the code, the build or the release of the package to `docs/`.
- Write each rule from the side of the project: what the project writes in its own code.
- Add each new file to the table `Read before a task` in `docs/usage.md`.
- Change `docs/` in the same change that makes it false.

## Property and parameter

- Write one or two description sentences for a property.
- Do not write the type. TypeScript gives it.
- Write a default that the signature does not show. Examples: a default of a destructured option, a default that the helper computes at run time.
- Set the default value in the parameters of the function.
- Write `@param` only when the name and the type do not explain the parameter.

## README and CHANGELOG

- Add a row to the table of its group in `docs/helpers.md` for each new helper. Write one description sentence in the row.
- Add a line to `CHANGELOG.md` under `### Unpublished`, in the group `Added`, `Changed`, `Removed` or `Fixed`.
- Add the heading `### Unpublished` at the top of `CHANGELOG.md` when it does not exist.
- Do not add a version heading. `npm run version:bump` renames `### Unpublished` to the version before the release.

## Comment in the code

- Write a comment for the reason of the code, not for the action of the code.
- Remove a comment that repeats the code.
