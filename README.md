# figma-plugin-utils

Helpers for working with the Figma node tree from a plugin sandbox.

Everything here is a primitive: it answers one question about a node or a tree and knows nothing about why it is
being asked.

Policy: what counts as part of a component, which node stands for "the component", how a run reports itself – stays in the module doing the asking.

The traversal helpers take predicates rather than flags, so a caller
keeps its own rules and this package keeps the walking.

Two conventions run through the whole package, and they are the reason it exists as a package at all:

1. **Nothing throws.** A helper that cannot answer returns the safe end of its type `false`, `null`, an empty list and logs. A plugin taken down by one bad node is worse than a partial answer.
2. **Nodes are never assumed to be alive.** A deleted node throws on any property access, and every helper that walks or reads one guards for it.

## Install

```sh
npm install figma-plugin-utils
```

The package is ESM-only and typed against [`@figma/plugin-typings`](https://www.npmjs.com/package/@figma/plugin-typings),
which your plugin already needs for the `figma` global. Nothing is bundled with it and there are no runtime
dependencies.

It ships one module per helper, so importing one function does not pull in the rest:

```ts
import { walkNodeTree, isLayerVisible, collectInstances } from 'figma-plugin-utils'
```

## Example

Collecting every visible instance under the selection, without descending into hidden branches:

```ts
import { collectInstances, isLayerVisible } from 'figma-plugin-utils'

const instances = figma.currentPage.selection.flatMap((node) =>
  collectInstances(node, {
    include: (instance) => isLayerVisible(instance),
    descend: (container) => isLayerVisible(container),
  }),
)
```

`walkNodeTree` is the loop underneath the collectors, for questions they do not answer. The visitor returns a verdict:
nothing to carry on, `'skip'` to leave the node's children alone, `'stop'` to end the walk, which is what makes it
usable for questions answered by the first hit.

```ts
import { walkNodeTree } from 'figma-plugin-utils'

const textNodes: TextNode[] = []

walkNodeTree(figma.currentPage, (node, depth) => {
  if (node.type === 'TEXT') textNodes.push(node)
  if (depth > 4) return 'skip'
  if (textNodes.length >= 100) return 'stop'
})
```

Nodes are visited in the order a designer sees in the layers panel – a node, then everything inside it, then its next
sibling. That is a promise, not an implementation detail: walk results end up in lists a user reads.

## API

**Traversal**

|                                          |                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `walkNodeTree(root, visit, options?)`    | Every node under a root, one call per node. `visit` returns `void \| 'skip' \| 'stop'` |
| `collectInstances(node, options?)`       | Instances below a node. Does not walk inside the instances it finds unless asked       |
| `hasDescendantMatching(node, predicate)` | Whether anything below a node matches — stops at the first hit                         |
| `getTopmostNodes(nodes)`                 | Drops the nodes that are already contained by another node in the list                 |

**Type guards and node questions**

|                                                                                        |                                                                                    |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `isComponentNode`, `isComponentSetNode`, `isFrameNode`, `isInstanceNode`, `isPageNode` | Narrowing guards on `BaseNode`                                                     |
| `isOneOfNodeType(node, typeList)`                                                      | Whether the node is one of several types                                           |
| `isNodeAlive(node)`                                                                    | Whether the handle still points at something — a deleted node throws on any access |
| `isRemoteNode(node)`                                                                   | Whether the node comes from a library                                              |
| `isLayerVisible(node, options?)`                                                       | The layer's own flag, optionally counting what a boolean property switches off     |
| `isNodeShown(node)`                                                                    | Visibility along the whole ancestor chain, up to the page                          |
| `hasInstanceAncestor(node)`                                                            | Whether anything above the node is an instance. Says nothing about the node itself |
| `asSceneNode(node)`                                                                    | A `SceneNode` or `null`, for the many API calls typed as `BaseNode`                |
| `findNodeByIdAsync(id, types)`                                                         | The node an id names if it is one of the types, narrowed to them, or `null`        |

**Identity**

|                         |                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `getNodeKey(node)`      | The published key, for a node that has one                                                |
| `getNodeIdentity(node)` | The key when there is one, the id otherwise — what to store when both kinds of node occur |
| `describeNode(node)`    | `{ id, name }` that survives a dead node, for logs and error messages                     |
| `getPageOfNode(node)`   | The page a node is on, or `null` — a remote or detached node has none                     |

**Components, variants, properties**

|                                                                                     |                                                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `getMainComponentOfInstanceAsync(instance)`                                         | The instance's main component. Stays on the variant rather than climbing to its set  |
| `getComponentSetOfVariant(component)`                                               | The set a variant belongs to, or `null`                                              |
| `isComponentSetVariant(node)`                                                       | Whether a node is a variant inside a component set                                   |
| `parseVariantName(name)`                                                            | `'Size=Large, State=Hover'` → `{ Size: 'Large', State: 'Hover' }`                    |
| `isValidVariant(input)`                                                             | Whether a string parses as a variant name                                            |
| `getPropertyName(key)`                                                              | The readable half of `'Show icon#12:3'`                                              |
| `getBooleanPropertyKey(node)`, `hasBooleanProperties(node)`                         | Boolean property keys on a node and on a component                                   |
| `getKeysOfInstanceSwapProperties(node)`, `isInstanceSwapTarget(instance, swapKeys)` | Instance-swap properties                                                             |
| `getBoundVariableRefs(node)`                                                        | Every variable bound on a node, from all three places Figma keeps them, deduplicated |
| `matchVariantName(name, keys)`                                                      | A variant name's values, checked against the keys its set declares                   |
| `validateVariantNames(variants, keys)`, `findInvalidVariants(set)`                  | Which variants of a set say no state of their own, and why — duplicates included     |
| `importComponentOrSetByKeyAsync(key, preferType?, options?)`                        | A published component or set by key, whichever it is: `found`, `empty` or `failed`   |

**Colour and paints**

These take and give plain numbers and strings, so the colour ones work in a plugin's UI as well as in its sandbox.
Hex is always upper case.

|                                               |                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `colorToHex(color)`, `colorToHexAlpha(color)` | `#RRGGBB` and `#RRGGBBAA` out of channels in 0–1                            |
| `hexAlphaToColor(hex)`                        | Six or eight hex digits back to `TColor`, or `null`                         |
| `roundAlpha(alpha)`                           | An alpha to a whole percentage, for comparing a stored one with a typed one |
| `applyOpacity(color, opacity?)`               | A paint's `opacity` folded into the colour's alpha                          |
| `getGradientHandlePositions(paint)`           | A gradient's start, end and width handles, out of `gradientTransform`       |

**Canvas**

|                                    |                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `focusNodesAsync(nodes, options?)` | Their page, the viewport around them, and the selection when `select` is on |
| `focusNodeByIdAsync(id, options?)` | The same, for the node an id names on any page                              |

**Stored data**

|                                                   |                                                                                   |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `hasRelaunchCommand(node, command)`               | Whether a node carries a relaunch command                                         |
| `setRelaunchCommand(node, command, description?)` | Adds one command to the ones a node carries — `setRelaunchData` replaces them all |
| `clearPluginDataAsync(keys)`                      | Every entry under the plugin's keys off the root and every node, counted          |

**Fonts**

|                              |                                                      |
| ---------------------------- | ---------------------------------------------------- |
| `canLoadFontAsync(fontName)` | Whether a font loads, before deciding to write in it |

**Mutation**

|                       |                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `clearChildren(node)` | Removes a node's children. Returns `false` and touches nothing for an instance or anything inside one, which Figma forbids emptying |

**Widgets**

`getSourceWidgetNode()`, `collectWidgetNodes(pages, options?)` and `readWidgetSyncedState(node, key)` answer the same
kind of question about widget nodes. They need nothing beyond `@figma/plugin-typings`; in a plugin, where
`figma.widgetId` is undefined, each returns its empty answer rather than throwing.

Every helper carries a doc comment explaining what it does and why it is shaped that way — the types shipped with the
package bring those into your editor.

## Development

```sh
npm run build       # ESM build into dist/
npm run typecheck
npm run lint
npm run format
```

See [CHANGELOG.md](CHANGELOG.md) for what changed between versions.

## License

MIT
