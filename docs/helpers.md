# Helpers

The index of the helpers of `figma-plugin-utils`, in groups. Each row names a helper and its answer in one sentence.
The rules, the edge cases and the examples of a helper are in its JSDoc.

- Search this index before you write a helper on Figma nodes. The package can have it already.

## Groups

**Walks**

|                                          |                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `walkNodeTree(root, visit, options?)`    | Each node under a root, one call for each node. `visit` returns `void \| 'skip' \| 'stop'` |
| `collectInstances(node, options?)`       | The instances below a node. It does not go into a found instance unless asked              |
| `hasDescendantMatching(node, predicate)` | Whether a node below a node matches. It stops at the first match                           |
| `getTopmostNodes(nodes)`                 | Removes the nodes that another node of the list contains                                   |

**Type guards and node questions**

|                                                                                        |                                                                                    |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `isComponentNode`, `isComponentSetNode`, `isFrameNode`, `isInstanceNode`, `isPageNode` | Type guards on `BaseNode`                                                          |
| `isOneOfNodeType(node, typeList)`                                                      | Whether the node has one of the types                                              |
| `isNodeAlive(node)`                                                                    | Whether the handle still points at a node. A deleted node throws on each read      |
| `isRemoteNode(node)`                                                                   | Whether the node comes from a library                                              |
| `isLayerVisible(node, options?)`                                                       | The flag of the layer. As an option, it counts the layers that a boolean turns off |
| `isNodeShown(node)`                                                                    | The visibility along the whole chain of ancestors, up to the page                  |
| `hasInstanceAncestor(node)`                                                            | Whether an ancestor of the node is an instance. The node itself does not count     |
| `asSceneNode(node)`                                                                    | A `SceneNode` or `null`, for the API calls that give a `BaseNode`                  |
| `findNodeByIdAsync(id, types)`                                                         | The node of an id when it has one of the types, narrowed to them, or `null`        |

**Identity**

|                         |                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `getNodeKey(node)`      | The publish key of a node that has one                                              |
| `getNodeIdentity(node)` | The key when there is one, the id otherwise. Store it when both types of node occur |
| `describeNode(node)`    | `{ id, name }`, also for a dead node, for logs and error messages                   |
| `getPageOfNode(node)`   | The page of a node, or `null`. A remote or detached node has no page                |

**Components, variants, properties**

|                                                                                     |                                                                                        |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `getMainComponentOfInstanceAsync(instance)`                                         | The main component of the instance. It stays on the variant and does not go to the set |
| `getComponentSetOfVariant(component)`                                               | The set of a variant, or `null`                                                        |
| `isComponentSetVariant(node)`                                                       | Whether a node is a variant in a component set                                         |
| `parseVariantName(name)`                                                            | `'Size=Large, State=Hover'` → `{ Size: 'Large', State: 'Hover' }`                      |
| `isValidVariant(input)`                                                             | Whether a string parses as a variant name                                              |
| `getPropertyName(key)`                                                              | The readable half of `'Show icon#12:3'`                                                |
| `getBooleanPropertyKey(node)`, `hasBooleanProperties(node)`                         | The boolean property keys of a node and of a component                                 |
| `getKeysOfInstanceSwapProperties(node)`, `isInstanceSwapTarget(instance, swapKeys)` | The instance swap properties                                                           |
| `getBoundVariableRefs(node)`                                                        | Each variable that a node binds, from the three places of Figma, with no duplicates    |
| `matchVariantName(name, keys)`                                                      | The values of a variant name, checked against the keys of its set                      |
| `validateVariantNames(variants, keys)`, `findInvalidVariants(set)`                  | The variants of a set with no state of their own, and the reason. Duplicates too       |
| `importComponentOrSetByKeyAsync(key, preferType?, options?)`                        | A published component or set by key: `found`, `empty` or `failed`                      |

**Color and paints**

These helpers take and give plain numbers and strings. So the color helpers work in the UI of a plugin and in its sandbox.
Hex is always upper case.

|                                               |                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| `colorToHex(color)`, `colorToHexAlpha(color)` | `#RRGGBB` and `#RRGGBBAA` from channels in 0–1                           |
| `hexAlphaToColor(hex)`                        | Six or eight hex digits back to `TColor`, or `null`                      |
| `colorToHsb(color)`, `hsbToColor(hsb)`        | `TColor` to `THsb` and back: the hue in degrees, the rest in 0–1         |
| `roundAlpha(alpha)`                           | An alpha as a whole percent, to compare a stored alpha with a typed one  |
| `applyOpacity(color, opacity?)`               | The `opacity` of a paint multiplied into the alpha of the color          |
| `getGradientHandlePositions(paint)`           | The start, end and width handles of a gradient, from `gradientTransform` |

**Variables and styles**

These helpers keep nothing between calls. The caller keeps a cache of the results and of the refusals.

|                                                  |                                                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `findVariableAsync(ref)`                         | The variable of a stored `{ id, key }` in this file: by id when the key matches, else by import |
| `findStyleAsync(ref, type)`                      | The same for a style of one type, narrowed to it. `'TEXT'` gives a `TextStyle`                  |
| `getLibraryVariableCollectionsAsync()`           | The collections of the enabled libraries, or `[]`. Without `teamlibrary`, the getter throws     |
| `createVariableLookup(variables?, collections?)` | Variables and collections by id. It asks the API only for the items that it did not get         |
| `resolveVariableValueAsync(variable, options?)`  | The value of a variable in the default mode of its collection, with aliases, without a node     |
| `resolveColorValueAsync(value, options?)`        | The color of such a value, also a color with a variable opacity, or `null`                      |
| `isVariableAlias(value)`                         | Whether a value is a reference to a variable                                                    |
| `toPaintPreview(paints)`                         | Paints as a swatch draws them: colors, gradients with handles, from the bottom, or `null`       |

**Canvas**

|                                    |                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `focusNodesAsync(nodes, options?)` | The page of the nodes, the viewport around them, and the selection with `select` |
| `focusNodeByIdAsync(id, options?)` | The same for the node of an id, on any page                                      |

**Order**

Fractional indexes: an item keeps its place in a list with a `position` string, not a number index.
So a move of one item changes one row and does not number the list again. The math uses no Figma API, so it works in the UI of a plugin and in its sandbox.

|                                                       |                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| `midpoint(a, b)`                                      | A position between two. `null` is an end of the list                       |
| `findPositionAfter(prev)`, `findPositionBefore(next)` | A position after or before one. `null` gives the end or the start          |
| `sortPositions(items)`                                | The items in list order by `position`, for the values of a map or a record |
| `recalcPositions(items, currentOrder, updatedOrder)`  | New positions after a drag and drop. The same array when nothing moved     |

```ts
import { findPositionAfter, recalcPositions, sortPositions } from 'figma-plugin-utils'

const items = sortPositions([...map.values()])
const appended = { id, position: findPositionAfter(items.at(-1)?.position ?? null) }
const reordered = recalcPositions(items, currentIds, draggedIds)
```

**Stored data**

|                                                   |                                                                                        |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `hasRelaunchCommand(node, command)`               | Whether a node has a relaunch command                                                  |
| `setRelaunchCommand(node, command, description?)` | Adds one command to the commands of a node. `setRelaunchData` replaces all of them     |
| `clearPluginDataAsync(keys)`                      | Removes each entry of the keys of the plugin from the root and each node, with a count |

**Fonts**

|                              |                                            |
| ---------------------------- | ------------------------------------------ |
| `canLoadFontAsync(fontName)` | Whether a font loads, before a write in it |

**Changes to nodes**

|                       |                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `clearChildren(node)` | Removes the children of a node. For an instance and its content it returns `false` and changes nothing |

**Storage and payment**

|                                                             |                                                                                                    |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `new ClientStorage(options)`                                | A versioned store in `figma.clientStorage`: `data`, `initAsync()`, `writeAsync()`, `deleteAsync()` |
| `new DocumentStorage(options)`                              | The same store in the plugin data of the document                                                  |
| `new NodeStorage(options)`                                  | Versioned plugin data of many nodes under one key. `read` does not write                           |
| `initStorageAsync(options)`                                 | The migration of the stores, for your own backend                                                  |
| `clientStorageAdapter(key)`, `pluginDataAdapter(node, key)` | The `read` and `write` pair of each backend. `write` says if the value was stored                  |
| `new Payment(options)`                                      | The payment status and the checkout of Figma. `onPaid` runs one time after a purchase              |
| `uuid()`                                                    | A random id for a stored entry                                                                     |

These classes keep data while the caller keeps the instance. They do not throw and do not show messages to the user.
A failure gives a safe answer, a log line and a call of `onError` of the caller. The project decides about a toast.

**Logs**

|                                          |                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `createLogger(scope, { isLogEnabled? })` | A logger for one scope. The payload is a function, so a logger that is off costs nothing |

```ts
const log = createLogger('selection', { isLogEnabled: () => config.debug })

log(() => ({ nodes: selection.map((node) => node.name) }))
```

**Widgets**

`getSourceWidgetNode()`, `collectWidgetNodes(pages, options?)` and `readWidgetSyncedState(node, key)` answer the same
questions about widget nodes. They need only `@figma/plugin-typings`.
In a plugin, `figma.widgetId` is `undefined`, and each of them returns its empty answer.

## The walk

`walkNodeTree` is the loop under the collectors, for the questions that they do not answer. The visit returns a decision:
no value to continue, `'skip'` to skip the children of the node, `'stop'` to end the walk.

The walk visits the nodes in the order of the layers panel: a node, then all the nodes in it, then its next sibling.
That order is a promise: the results of a walk go into lists that a user reads.

```ts
import { collectInstances, isLayerVisible } from 'figma-plugin-utils'

// Each visible instance under the selection, with no hidden branches
const instances = figma.currentPage.selection.flatMap((node) =>
  collectInstances(node, {
    include: (instance) => isLayerVisible(instance),
    descend: (container) => isLayerVisible(container),
  }),
)
```

## Logs of a large project

- Make a logger for each scope with `createLogger`. The scope is before each line, so the logs of two modules do not mix.
- Put the check of the switch in one function and give it to each logger.
- Keep the type of logs in a second setting when the project has many logs. Then the two types of logs do not hide each other.
