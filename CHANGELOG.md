# Changelog

### Version 2.0.0

- Breaking:
  - `getPage` → `getPageOfNode`. Returns `PageNode | null` instead of `PageNode`. The old one recursed on `parent`
    without checking it, so a remote component or a detached node — both of which end their ancestor chain at `null` —
    took it down.
  - `getNestedInstances` → `collectInstances`. Takes `{ descendIntoInstances, include, descend }`. It no longer walks
    inside the instances it finds by default: their children mirror their own master, so that content is reached again
    through the master itself. Filtering moved from every caller into the `include` / `descend` predicates.
  - `getMainComponentOfInstanceAsync` no longer climbs from a variant to its component set, and is typed
    `Promise<ComponentNode | null>` accordingly. The climb hid the variant from every caller — use
    `getComponentSetOfVariant` on the result when the set is what is wanted.
  - `hasInstanceParent` → `hasInstanceAncestor`, and it no longer counts the node itself: an instance answers `false`
    about itself, since nothing above it is an instance. The old name said "parent" while answering about the node,
    which is why call sites ended up written as `hasInstanceParent(node) || node.type === 'INSTANCE'` — that is now
    `isInstanceNode(node) || hasInstanceAncestor(node)`, and means what it reads as.
  - `getKeysOfInstanceSwapProperties` returns `string[]` instead of `string[] | undefined`. Unreadable definitions now
    give an empty list: with no keys nothing can be a swap target, which is what every caller's `?? []` already made
    of it.
  - `clearChildren` returns `boolean` instead of `void`, and refuses to touch the content of an instance or of
    anything nested in one. Figma forbids removing those children, so the old version threw partway through and left
    the node half emptied.

- Added:
  - collectInstances
  - describeNode
  - getBoundVariableRefs
  - getComponentSetOfVariant
  - getNodeIdentity
  - getPageOfNode
  - getTopmostNodes
  - hasInstanceAncestor
  - isInstanceSwapTarget
  - isLayerVisible
  - isNodeAlive
  - asSceneNode
  - getBooleanPropertyKey
    hasBooleanProperties
  - getNodeKey
  - getPropertyName
  - hasDescendantMatching
  - isRemoteNode
  - parseVariantName
  - walkNodeTree
  - collectWidgetNodes
  - getSourceWidgetNode
  - readWidgetSyncedState

- Docs:
  - Every helper now carries a JSDoc block: what it answers, when to reach for it, and the edge cases behind the
    guards. Examples are there where a call site says more than a paragraph would.

### Version 1.2.0

...

### Version 1.1.0

- Added:
  - getPage
  - isPageNode

### Version 1.0.0

- Added:
  - isComponentSetNode
  - isComponentNode
  - isFrameNode
  - isInstanceNode
  - isOneOfNodeType
