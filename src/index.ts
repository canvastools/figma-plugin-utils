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
 */

export { clearChildren } from './clearChildren'
export { collectInstances } from './collectInstances'

export { describeNode } from './describeNode'

export { getComponentSetOfVariant } from './getComponentSetOfVariant'
export { getKeysOfInstanceSwapProperties } from './getKeysOfInstanceSwapProperties'
export { getMainComponentOfInstanceAsync } from './getMainComponentOfInstanceAsync'
export { getPageOfNode } from './getPageOfNode'
export { getTopmostNodes } from './getTopmostNodes'

export { hasBooleanProperties } from './hasBooleanProperties'
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

export { isValidVariant } from './isValidVariant'

/* Types */

export type { TCollectInstancesOptions } from './collectInstances'
