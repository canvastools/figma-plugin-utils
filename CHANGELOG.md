# Changelog

### Unpublished

- Added:
  - `VariableCatalog`: the variables of the file and of the enabled libraries and the styles of the file, as `TCatalogData` for a list of the UI. A library is read when the UI asks, in steps
  - `bindVariableAsync`, `bindVariableToPaintAsync`: the binding of a node or of a paint to the variable of a `TPublishedRef` or of a row of the catalog
  - `TVariableCatalogOptions`, `TScanCatalogOptions`: the options of `VariableCatalog` and of its `scanAsync`
  - `figma-plugin-utils/ui`: the helpers that do not use the Figma API, for the UI of a plugin. Its types do not use the global types of Figma
  - The types of the catalog: `TCatalogData`, `TCatalogItem`, `TCatalogVariable`, `TCatalogStyle`, `TCatalogLibrary`, `TCatalogCollection`, `TCatalogVariableValue`
  - `modes` option of `resolveVariableValueAsync`: the mode of each collection, for example `node.resolvedVariableModes`
  - `toSolidPaint`: a color with an alpha as a solid paint, the reverse of `applyOpacity`. It removes `boundVariables`, also for a new opacity alone
  - `@figma/plugin-typings` `>=1.143.0` as a peer dependency

- Changed:
  - `TColor` is the `RGBA` of Figma
  - The color and paint helpers take the types from `@figma/plugin-typings/plugin-api-standalone`. The UI of a plugin can call them with full types
  - `TPublishedRef.id` can be `null`: a variable of a library that is not imported yet has only its key. `findVariableAsync` and `findStyleAsync` then go to the import
  - `TStyleOfType` is generic: `TStyleOfType<'TEXT'>` is `TextStyle`. It covers each style type of Figma
  - `preferType` of `importComponentOrSetByKeyAsync` accepts only `'COMPONENT'` and `'COMPONENT_SET'`
  - `TLoggerOptions` is `TCreateLoggerOptions`, `TImportByKeyOptions` is `TImportComponentOrSetByKeyOptions`
  - `getLibraryVariableCollectionsAsync` and `clearChildren` do not log an expected refusal of Figma

- Fixed:
  - `bindVariableAsync` and `bindVariableToPaintAsync` do not throw when Figma refuses a binding

### Version 2.3.0

- Added:
  - Documentation for agents
  - `colorToHsb`, `hsbToColor` and `THsb` type: a color in the HSB model, the model of the color picker of Figma
  - Options types: `TCollectWidgetNodesOptions`, `TFocusNodesOptions`, `TImportByKeyOptions`, `TIsLayerVisibleOptions`

- Fixed:
  - `getTopmostNodes` threw on a deleted node in the list. It removes such a node and does not throw.
  - The JSDoc of the options of `collectInstances`, `resolveVariableValueAsync` and `walkNodeTree` was not in the `.d.ts` files.

### Version 2.2.0

- Added:
  - `createLogger`: a logger for one scope. The payload is a function, and `isLogEnabled` is the switch of the project
  - `ClientStorage`
  - `DocumentStorage`
  - `NodeStorage`
  - `initStorageAsync`
  - `clientStorageAdapter`
  - `pluginDataAdapter`
  - `Payment`
  - `uuid`
  - Fractional indexes: `findPositionAfter`, `findPositionBefore`, `midpoint`, `recalcPositions`, `sortPositions`

- Changed:
  - `initStorage` → `initStorageAsync`

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
