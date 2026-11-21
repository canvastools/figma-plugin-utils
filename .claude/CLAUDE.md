# figma-plugin-utils

What the package is and its conventions are in `docs/` and in the comment of `src/index.ts`. Read `docs/usage.md` before a change.

## Commands

```bash
npm run build       # vite build → dist/
npm run typecheck
npm run lint
npm run format
npm run prod        # lint + typecheck + build
```

## Code

- One helper in one file of `src/`, named as the helper: `getPageOfNode.ts` exports `getPageOfNode`.
- Export each helper from `src/index.ts`, types with `export type`.
- A helper is an arrow function, a store is a class. `export { name }` at the end of the file.
- Names: `TName` for a type, `…Async` for a function that returns a promise.
- No semicolons, single quotes, a comma after the last item, print width 128 (`.prettierrc`).
- The package knows nothing of a project that uses it. No names, paths or rules of a project in the code or the docs.

## Docs

- Follow `rules/language.md` (ASD-STE100) and `rules/docs.md`.
- Search the JSDoc, `docs/` and `README.md` before you write. Do not write the same fact in two places.
- Change the docs in the same change as the code.
