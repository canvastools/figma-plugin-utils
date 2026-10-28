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
 *
 * The colour helpers (`colorToHex`, `colorToHexAlpha`, `hexAlphaToColor`,
 * `roundAlpha`) touch no Figma API at all, and are read by a plugin's UI as well
 * as by its sandbox.
 *
 * The variable and style helpers (`findVariableAsync`, `findStyleAsync`,
 * `resolveVariableValueAsync`, `resolveColorValueAsync`, `createVariableLookup`,
 * `getLibraryVariableCollectionsAsync`) keep nothing between calls: a cache of
 * what resolved, or of what was refused, is the caller's to keep and to forget.
 * `createVariableLookup` holds what it is handed for as long as its caller
 * holds it, and no longer.
 */

export { applyOpacity } from './applyOpacity'
export { asSceneNode } from './asSceneNode'

export { canLoadFontAsync } from './canLoadFontAsync'
export { clearChildren } from './clearChildren'
export { clearPluginDataAsync } from './clearPluginDataAsync'
export { collectInstances } from './collectInstances'
export { collectWidgetNodes } from './collectWidgetNodes'
export { colorToHex } from './colorToHex'
export { colorToHexAlpha } from './colorToHexAlpha'
export { createVariableLookup } from './createVariableLookup'

export { describeNode } from './describeNode'

export { findInvalidVariants } from './findInvalidVariants'
export { findNodeByIdAsync } from './findNodeByIdAsync'
export { findStyleAsync } from './findStyleAsync'
export { findVariableAsync } from './findVariableAsync'
export { focusNodeByIdAsync } from './focusNodeByIdAsync'
export { focusNodesAsync } from './focusNodesAsync'

export { getBooleanPropertyKey } from './getBooleanPropertyKey'
export { getBoundVariableRefs } from './getBoundVariableRefs'
export { getComponentSetOfVariant } from './getComponentSetOfVariant'
export { getGradientHandlePositions } from './getGradientHandlePositions'
export { getKeysOfInstanceSwapProperties } from './getKeysOfInstanceSwapProperties'
export { getLibraryVariableCollectionsAsync } from './getLibraryVariableCollectionsAsync'
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
export { hasRelaunchCommand } from './hasRelaunchCommand'
export { hexAlphaToColor } from './hexAlphaToColor'

export { importComponentOrSetByKeyAsync } from './importComponentOrSetByKeyAsync'

export { isComponentNode } from './isComponentNode'
export { isComponentSetNode } from './isComponentSetNode'
export { isComponentSetVariant } from './isComponentSetVariant'
export { isFrameNode } from './isFrameNode'
export { isInstanceNode } from './isInstanceNode'
export { isInstanceSwapTarget } from './isInstanceSwapTarget'
export { isLayerVisible } from './isLayerVisible'
export { isNodeAlive } from './isNodeAlive'
export { isNodeShown } from './isNodeShown'
export { isOneOfNodeType } from './isOneOfNodeType'
export { isPageNode } from './isPageNode'
export { isRemoteNode } from './isRemoteNode'
export { isVariableAlias } from './isVariableAlias'

export { isValidVariant } from './isValidVariant'
export { matchVariantName } from './matchVariantName'
export { parseVariantName } from './parseVariantName'
export { validateVariantNames } from './validateVariantNames'

export { readWidgetSyncedState } from './readWidgetSyncedState'
export { resolveColorValueAsync } from './resolveColorValueAsync'
export { resolveVariableValueAsync } from './resolveVariableValueAsync'
export { roundAlpha } from './roundAlpha'

export { setRelaunchCommand } from './setRelaunchCommand'

export { toPaintPreview } from './toPaintPreview'

export { walkNodeTree } from './walkNodeTree'

/* Types */

export type { TCollectInstancesOptions } from './collectInstances'
export type { TColor } from './colorTypes'
export type { TVariableLookup } from './createVariableLookup'
export type { TStyleOfType } from './findStyleAsync'
export type { TPublishedRef } from './findVariableAsync'
export type { TBoundVariableRef, TBoundVariableSource } from './getBoundVariableRefs'
export type { TImportByKeyOutcome } from './importComponentOrSetByKeyAsync'
export type { TInvalidVariantReason, TMatchedVariantName } from './matchVariantName'
export type { TResolveVariableValueOptions } from './resolveVariableValueAsync'
export type { TGradientPreview, TPaintPreview, TPaintPreviewLayer } from './toPaintPreview'
export type { TInvalidVariant, TValidatedVariants, TVariantName } from './validateVariantNames'
export type { TWalkNodeTreeOptions, TWalkVerdict } from './walkNodeTree'
