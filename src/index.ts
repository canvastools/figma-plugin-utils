/**
 * `figma-plugin-utils`: helpers for the Figma node tree in a plugin sandbox.
 *
 * Each helper is a primitive: it answers one question about a node or a tree. It does not know the reason for the question.
 * The policy belongs to the module that asks: what is part of a component, which node is "the component", how a run reports.
 *
 * The package has two conventions:
 *
 * - Nothing throws. A helper that cannot answer returns the safe end of its type (`false`, `null`, an empty list) and logs.
 *   A plugin that one bad node stops is worse than a partial answer.
 * - A node is not always alive. A deleted node throws on each property read, and each helper that reads a node guards for it.
 *
 * The walk helpers take predicates, not flags. So the caller keeps its rules, and this package keeps the walk.
 *
 * Some helpers answer the same questions about widget nodes: `getSourceWidgetNode`, `collectWidgetNodes`, `readWidgetSyncedState`.
 * They follow the two conventions and need only `@figma/plugin-typings`.
 * In a plugin, `figma.widgetId` is `undefined`, and each of them returns its empty answer.
 *
 * The color helpers (`colorToHex`, `colorToHexAlpha`, `hexAlphaToColor`, `roundAlpha`) use no Figma API.
 * So the UI of a plugin uses them too, as does its sandbox.
 * The fractional indexes (`midpoint`, `sortPositions`, `recalcPositions`, …) also use no Figma API. They keep a stored list in order.
 *
 * `createLogger` gives a logger to each scope. The logger builds its payload only when it prints.
 * The caller owns the switch, so the package has no config of a project.
 *
 * The variable and style helpers keep nothing between calls: `findVariableAsync`, `findStyleAsync`, `resolveVariableValueAsync`,
 * `resolveColorValueAsync`, `createVariableLookup`, `getLibraryVariableCollectionsAsync`.
 * The caller keeps a cache of the results or of the refusals, and the caller clears it.
 * `createVariableLookup` holds its data while its caller holds the lookup.
 *
 * The stores and `Payment` are primitives of the same kind: `ClientStorage`, `DocumentStorage`, `NodeStorage`, `initStorageAsync`
 * and the two adapters.
 * They work over `figma.clientStorage`, plugin data and `figma.payments`. An instance keeps its data while its caller keeps the instance.
 * They do not throw and do not show messages to the user.
 * A failure gives a safe answer, a log line and a call of `onError` or `onPaid` of the caller. The project decides about a toast.
 */

export { applyOpacity } from './applyOpacity'
export { asSceneNode } from './asSceneNode'

export { canLoadFontAsync } from './canLoadFontAsync'
export { clearChildren } from './clearChildren'
export { clearPluginDataAsync } from './clearPluginDataAsync'
export { ClientStorage } from './ClientStorage'
export { clientStorageAdapter } from './clientStorageAdapter'
export { collectInstances } from './collectInstances'
export { collectWidgetNodes } from './collectWidgetNodes'
export { colorToHex } from './colorToHex'
export { colorToHexAlpha } from './colorToHexAlpha'
export { createLogger } from './createLogger'
export { createVariableLookup } from './createVariableLookup'

export { describeNode } from './describeNode'
export { DocumentStorage } from './DocumentStorage'

export { findInvalidVariants } from './findInvalidVariants'
export { findNodeByIdAsync } from './findNodeByIdAsync'
export { findStyleAsync } from './findStyleAsync'
export { findVariableAsync } from './findVariableAsync'
export { focusNodeByIdAsync } from './focusNodeByIdAsync'
export { focusNodesAsync } from './focusNodesAsync'
export { findPositionAfter, findPositionBefore, midpoint, recalcPositions, sortPositions } from './fractionalIndex'

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
export { initStorageAsync } from './initStorageAsync'

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

export { NodeStorage } from './NodeStorage'

export { parseVariantName } from './parseVariantName'
export { Payment } from './Payment'
export { pluginDataAdapter } from './pluginDataAdapter'
export { validateVariantNames } from './validateVariantNames'

export { readWidgetSyncedState } from './readWidgetSyncedState'
export { resolveColorValueAsync } from './resolveColorValueAsync'
export { resolveVariableValueAsync } from './resolveVariableValueAsync'
export { roundAlpha } from './roundAlpha'

export { setRelaunchCommand } from './setRelaunchCommand'

export { toPaintPreview } from './toPaintPreview'

export { uuid } from './uuid'

export { walkNodeTree } from './walkNodeTree'

/* Types */

export type { TCollectInstancesOptions } from './collectInstances'
export type { TColor } from './colorTypes'
export type { TLogger, TLoggerOptions } from './createLogger'
export type { TVariableLookup } from './createVariableLookup'
export type { TStyleOfType } from './findStyleAsync'
export type { TPublishedRef } from './findVariableAsync'
export type { TBoundVariableRef, TBoundVariableSource } from './getBoundVariableRefs'
export type { TImportByKeyOutcome } from './importComponentOrSetByKeyAsync'
export type { TInvalidVariantReason, TMatchedVariantName } from './matchVariantName'
export type { TPaymentCheckoutOptions, TPaymentData, TPaymentOptions } from './Payment'
export type { TResolveVariableValueOptions } from './resolveVariableValueAsync'
export type {
  TInitStorageOptions,
  TNodeStoredData,
  TNodeStoreOptions,
  TStorageAdapter,
  TStorageErrorHandler,
  TStorageErrorKind,
  TStoreOptions,
  TSyncStorageAdapter,
  TVersionedData,
} from './storageTypes'
export type { TGradientPreview, TPaintPreview, TPaintPreviewLayer } from './toPaintPreview'
export type { TInvalidVariant, TValidatedVariants, TVariantName } from './validateVariantNames'
export type { TWalkNodeTreeOptions, TWalkVerdict } from './walkNodeTree'
