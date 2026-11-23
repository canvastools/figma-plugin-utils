# figma-plugin-utils

What the package is and its conventions are in `docs/`. Read `docs/usage.md` before a change.

## Work with the user

- Answer in the language of the user. Write the files in English by `rules/language.md`.
- Ask the user when a point of the task is not clear. Do not start the work while a question is open.
- Do not select an interpretation for the user.
- Ask the user when an instruction of the user breaks a rule of this package. Tell the user the rule, and do not select a way for the user.
- Show the plan to the user before you change a file. Start the changes after the user agrees.
- Ask before a command that writes a file in git outside the task, for example a build into `dist/`.
- Do not commit, push or publish. The user does these actions.
- Start a report with the result in one sentence.
- Write only that sentence when the work finds no problems, each check passes and `Not verified` is empty.
- Keep a `Not verified` section in each other report, also when it is empty.
- Put a check that did not run in `Not verified`. Do not report it as passed.
- Name a place as `file:line`.

## Commands

```bash
npm run build       # vite build → dist/
npm run typecheck
npm run lint        # ESLint and the link check of the Markdown files
npm run format      # writes the files
npm run format:check
npm run prod        # lint + typecheck + build
npm run version:bump -- patch | minor | major | x.y.z
npm run release:check
```

The release and the publication are in `PUBLICATION.md`.

## Code

- One helper in one file of `src/`, named as the helper: `getPageOfNode.ts` exports `getPageOfNode`.
- Export each helper from `src/index.ts`, types with `export type`.
- A helper is an arrow function, a store is a class. `export { name }` at the end of the file.
- Names: `TName` for a type, `…Async` for a function that returns a promise.
  An adapter member that can be sync or async keeps its plain name: `read`, `write`.
- Export a type at its declaration: `export type TName = …`.
- Put a type that two or more files use in `<group>Types.ts`, for example `colorTypes.ts`.
- Declare the options of a helper as an exported type `T<Helper>Options`, not inline.
- Log a caught error as `console.log('Error in <name>() :', error)`.
- No semicolons, single quotes, a comma after the last item, print width 128 (`.prettierrc`).
- The package knows nothing of a project that uses it. No names, paths or rules of a project in the code or the docs.

## Docs

- Follow `rules/language.md` (ASD-STE100) and `rules/docs.md`.
- Search the JSDoc, `docs/` and `README.md` before you write. Do not write the same fact in two places.
- Change the docs in the same change as the code.
