/**
 * `figma-plugin-utils` — helpers for working with the Figma node tree from a
 * plugin sandbox.
 *
 * Everything here is a primitive: it answers one question about a node or a
 * tree and knows nothing about why it is being asked. Policy — what counts as
 * part of a component, which node stands for "the component", how a run reports
 * itself — belongs to the module doing the asking.
 *
 * Two conventions run through the package:
 *
 * 1. Nothing throws. A helper that cannot answer returns the safe end of its
 *    type (`false`, `null`, an empty list) and logs, because a plugin taken down
 *    by one bad node is worse than a partial answer.
 * 2. Nodes are never assumed to be alive. A deleted node throws on any property
 *    access, and every helper that walks or reads one guards for it.
 *
 * The traversal helpers take predicates rather than flags, so the caller keeps
 * its own rules and this package keeps the walking.
 *
 * A handful of helpers answer the same kind of question about widget nodes
 * (`getSourceWidgetNode`, `collectWidgetNodes`, `readWidgetSyncedState`). They
 * follow both conventions above and need nothing beyond `@figma/plugin-typings`;
 * in a plugin, where `figma.widgetId` is undefined, each returns its empty
 * answer rather than throwing.
 */

export { asSceneNode } from './asSceneNode'

export { clearChildren } from './clearChildren'
export { collectInstances } from './collectInstances'
export { collectWidgetNodes } from './collectWidgetNodes'

export { describeNode } from './describeNode'

export { getBooleanPropertyKey } from './getBooleanPropertyKey'
export { getBoundVariableRefs } from './getBoundVariableRefs'
export { getComponentSetOfVariant } from './getComponentSetOfVariant'
export { getKeysOfInstanceSwapProperties } from './getKeysOfInstanceSwapProperties'
export { getMainComponentOfInstanceAsync } from './getMainComponentOfInstanceAsync'
export { getNodeIdentity } from './getNodeIdentity'
export { getNodeKey } from './getNodeKey'
export { getPageOfNode } from './getPageOfNode'
export { getPropertyName } from './getPropertyName'
export { getSourceWidgetNode } from './getSourceWidgetNode'
export { getTopmostNodes } from './getTopmostNodes'

export { hasBooleanProperties } from './hasBooleanProperties'
export { hasDescendantMatching } from './hasDescendantMatching'
export { hasInstanceAncestor } from './hasInstanceAncestor'

export { isComponentNode } from './isComponentNode'
export { isComponentSetNode } from './isComponentSetNode'
export { isComponentSetVariant } from './isComponentSetVariant'
export { isFrameNode } from './isFrameNode'
export { isInstanceNode } from './isInstanceNode'
export { isInstanceSwapTarget } from './isInstanceSwapTarget'
export { isLayerVisible } from './isLayerVisible'
export { isNodeAlive } from './isNodeAlive'
export { isOneOfNodeType } from './isOneOfNodeType'
export { isPageNode } from './isPageNode'
export { isRemoteNode } from './isRemoteNode'

export { isValidVariant } from './isValidVariant'
export { parseVariantName } from './parseVariantName'

export { readWidgetSyncedState } from './readWidgetSyncedState'

export { walkNodeTree } from './walkNodeTree'

/* Types */

export type { TCollectInstancesOptions } from './collectInstances'
export type { TBoundVariableRef, TBoundVariableSource } from './getBoundVariableRefs'
export type { TWalkNodeTreeOptions, TWalkVerdict } from './walkNodeTree'
