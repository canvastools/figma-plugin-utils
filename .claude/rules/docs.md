---
paths:
  - 'src/**/*.ts'
  - 'README.md'
  - 'CHANGELOG.md'
---

# Documentation

The JSDoc is the documentation of a helper. It goes into the `.d.ts` files, so the code that uses the package reads it.
`README.md` gives the package, its conventions and a table of the helpers. It does not repeat the JSDoc.

The language conventions are in `language.md`.

## What gets a JSDoc

- Each exported helper, class and method.
- Each property of an options type.
- A type of options needs no JSDoc of its own. The JSDoc is on each property.

## Helper

The JSDoc of a helper has three sections, in this order:

1. The description: one paragraph. It says what the helper gives and when to use it. It says why the helper works this way when a simpler way fails.
2. The instructions: a list. Each item says what to do or what not to do.
3. The examples: one `@example` for each instruction that changes the code. An instruction that shows its code needs no example.

- Write the safe answer of the helper in the description: `false`, `null` or an empty list.
- Start the code of each example with a comment that names its case, when there are two or more.

## Property and parameter

- Write one or two description sentences for a property.
- Do not write the type or the default value. TypeScript gives them.
- Set the default value in the parameters of the function.
- Write `@param` only when the name and the type do not explain the parameter.

## README and CHANGELOG

- Add a row to the table of its group in `## API` for each new helper. Write one description sentence in the row.
- Add a line to `CHANGELOG.md` under the next version, in the group `Added`, `Changed` or `Removed`.

## Comment in the code

- Write a comment for the reason of the code, not for the action of the code.
- Remove a comment that repeats the code.
