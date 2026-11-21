# figma-plugin-utils

Helpers for the Figma node tree in a plugin sandbox.

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

The changes between versions are in [CHANGELOG.md](CHANGELOG.md).

## License

MIT
