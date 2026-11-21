# figma-plugin-utils

Helpers for the Figma node tree in a plugin sandbox.

Each helper is a primitive: it answers one question about a node or a tree. It does not know the reason for the question.
Two conventions apply to the whole package: nothing throws, and a node is not always alive.

## Install

```sh
npm install figma-plugin-utils
```

```ts
import { walkNodeTree, isLayerVisible, collectInstances } from 'figma-plugin-utils'
```

## Documentation

- [`docs/usage.md`](docs/usage.md): the entry. What the package gives, the conventions, the rules for a project.
- [`docs/helpers.md`](docs/helpers.md): the index of the helpers, in groups.

Each helper has a JSDoc: what it does and why it works this way. The types of the package show it in your editor.

## Development

```sh
npm run build       # ESM build into dist/
npm run typecheck
npm run lint
npm run format
```

The changes between versions are in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
