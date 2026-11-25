# figma-plugin-utils in a project

The rules for each project that uses `figma-plugin-utils`. This file goes in the package, so it always matches the installed version.
The `.claude/CLAUDE.md` of a project imports it: `@../node_modules/figma-plugin-utils/docs/usage.md`.

- Do not copy this file into a project. Do not edit it in `node_modules`.

## What the package gives

Helpers for the Figma node tree in a plugin sandbox, the colors and paints, the variables and styles with `VariableCatalog`, the stores over `figma.clientStorage` and plugin data, the payment, the logs.
Each helper is a primitive: it answers one question about a node or a tree. It does not know the reason for the question.
The module that asks keeps the policy: what is part of a component, which node is "the component", how a run reports.

```ts
import { walkNodeTree, isLayerVisible, collectInstances } from 'figma-plugin-utils'
```

The package is ESM only, with one module for each helper. An import of one helper does not load the others.
Its types use `@figma/plugin-typings`. The package has no runtime dependencies.

The package has two entries:

- `figma-plugin-utils`: each helper, for the plugin sandbox.
- `figma-plugin-utils/ui`: the helpers that do not use the Figma API, for the UI of a plugin. Its types do not use the global types of Figma.

## Two sources of knowledge

| Source                                                     | Content                                                  |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| The JSDoc in `node_modules/figma-plugin-utils/dist/*.d.ts` | One helper: its answer, its edge cases, its examples.    |
| The files in `node_modules/figma-plugin-utils/docs/`       | The conventions of all helpers and the index of helpers. |

- Read the JSDoc of a helper before you use it. The editor shows it, and the `.d.ts` files hold it.

## Conventions

1. Nothing throws. A helper that cannot answer returns the safe end of its type (`false`, `null`, an empty list).
   It logs an unexpected error. An expected refusal of Figma gives the safe answer with no log.
   A partial answer is better than a plugin that one bad node stops.
2. A node is not always alive. A deleted node throws on each property read. Each helper that reads a node guards for it.

- Read the safe answer as a normal answer. Do not wrap a helper in `try`.
- Give a walk helper a predicate for your rules. The package keeps the walk, and the project keeps the rules.
- Keep the cache of the variable and style helpers in the project. They keep nothing between calls. `VariableCatalog` is the exception: keep one catalog in the plugin code.
- Keep one instance of a store or of `Payment` for each key. The instance keeps the data while the project keeps the instance.
- Show a message to the user from `onError` of a store. The package logs and does not show messages.
- Import the helpers in the UI from `figma-plugin-utils/ui`. The types of the main entry use the global types of Figma, and they conflict with the DOM.
- Import a type of Figma in the UI from `@figma/plugin-typings/plugin-api-standalone`: `import type { Paint } from '@figma/plugin-typings/plugin-api-standalone'`.
- Use the widget helpers in a plugin too. There `figma.widgetId` is `undefined`, and each of them returns its empty answer.

## Read before a task

| Task                                                       | File                                              |
| ---------------------------------------------------------- | ------------------------------------------------- |
| One helper                                                 | its JSDoc in `dist/`                              |
| A new helper on nodes, a walk, a store, the payment, a log | `node_modules/figma-plugin-utils/docs/helpers.md` |
