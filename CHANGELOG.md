# Changelog

### Version 2.2.0

- Added:
  - `createLogger`: a logger for one scope. The payload is a function, and `isLogEnabled` is the switch of the project
  - `ClientStorage`
  - `DocumentStorage`
  - `NodeStorage`
  - `initStorageAsync` (was `initStorage`)
  - `clientStorageAdapter`
  - `pluginDataAdapter`
  - `Payment`
  - `uuid`
  - Fractional indexes: `findPositionAfter`, `findPositionBefore`, `midpoint`, `recalcPositions`, `sortPositions`

### Version 2.1.0

- Added:
  - `applyOpacity`
  - `canLoadFontAsync`
  - `clearPluginDataAsync`
  - `colorToHex`
  - `colorToHexAlpha`
  - `createVariableLookup`
  - `findInvalidVariants`
  - `findNodeByIdAsync`
  - `findStyleAsync`
  - `findVariableAsync`
  - `focusNodeByIdAsync`
  - `focusNodesAsync`
  - `getGradientHandlePositions`
  - `getLibraryVariableCollectionsAsync`
  - `hasRelaunchCommand`
  - `hexAlphaToColor`
  - `importComponentOrSetByKeyAsync`
  - `isNodeShown`
  - `isVariableAlias`
  - `matchVariantName`
  - `resolveColorValueAsync`
  - `resolveVariableValueAsync`
  - `roundAlpha`
  - `setRelaunchCommand`
  - `toPaintPreview`
  - `validateVariantNames`

- Fixed:
  - The README said that `isLayerVisible` walks the chain of ancestors. It does not: it answers about the layer itself.
    `isNodeShown` walks up to the page.

### Version 2.0.0

- Changed, not compatible with version 1:
  - `getPage` → `getPageOfNode`. It returns `PageNode | null`, not `PageNode`. The old helper followed `parent` and did not
    check it. A remote component or a detached node ends its chain of ancestors at `null`, and both stopped the old helper.
  - `getNestedInstances` → `collectInstances`. It takes `{ descendIntoInstances, include, descend }`.
    By default it does not go into a found instance: the children of an instance repeat its main component.
    The caller reaches that content through the main component. The filter moved from each caller into the `include` and `descend` predicates.
  - `getMainComponentOfInstanceAsync` does not go up from a variant to its component set. Its type is `Promise<ComponentNode | null>`.
    The step up hid the variant from each caller. Use `getComponentSetOfVariant` on the result when you need the set.
  - `hasInstanceParent` → `hasInstanceAncestor`. It does not count the node itself: an instance gives `false`, because no ancestor is an instance.
    The old name said "parent" but answered about the node. So call sites had `hasInstanceParent(node) || node.type === 'INSTANCE'`.
    The new form is `isInstanceNode(node) || hasInstanceAncestor(node)`, and it means what it says.
  - `getKeysOfInstanceSwapProperties` returns `string[]`, not `string[] | undefined`. Definitions that it cannot read give an empty list.
    With no keys, no instance is a swap target. Each caller already did the same with `?? []`.
  - `clearChildren` returns `boolean`, not `void`. It does not change the content of an instance or of a node in an instance.
    Figma does not let a plugin remove those children, so the old helper threw in the middle and left the node half empty.

- Added:
  - `collectInstances`
  - `describeNode`
  - `getBoundVariableRefs`
  - `getComponentSetOfVariant`
  - `getNodeIdentity`
  - `getPageOfNode`
  - `getTopmostNodes`
  - `hasInstanceAncestor`
  - `isInstanceSwapTarget`
  - `isLayerVisible`
  - `isNodeAlive`
  - `asSceneNode`
  - `getBooleanPropertyKey`
  - `hasBooleanProperties`
  - `getNodeKey`
  - `getPropertyName`
  - `hasDescendantMatching`
  - `isRemoteNode`
  - `parseVariantName`
  - `walkNodeTree`
  - `collectWidgetNodes`
  - `getSourceWidgetNode`
  - `readWidgetSyncedState`

- Docs:
  - Each helper has a JSDoc: what it answers, when to use it, and the edge cases of the guards.
    An example is there when a call site says more than a paragraph.

### Version 1.2.0

...

### Version 1.1.0

- Added:
  - `getPage`
  - `isPageNode`

### Version 1.0.0

- Added:
  - `isComponentSetNode`
  - `isComponentNode`
  - `isFrameNode`
  - `isInstanceNode`
  - `isOneOfNodeType`
