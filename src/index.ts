/**
 * `figma-plugin-utils`: helpers for the Figma node tree in a plugin sandbox.
 *
 * The conventions of the package are in `docs/usage.md`. The index of the helpers is in `docs/helpers.md`.
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
export { colorToHsb } from './colorToHsb'
export { createLogger } from './createLogger'
export { bindVariableAsync } from './bindVariableAsync'
export { bindVariableToPaintAsync } from './bindVariableToPaintAsync'
export { createVariableLookup } from './createVariableLookup'
export { VariableCatalog } from './VariableCatalog'

export { describeNode } from './describeNode'
export { DocumentStorage } from './DocumentStorage'

export { findInvalidVariants } from './findInvalidVariants'
export { findNodeByIdAsync } from './findNodeByIdAsync'
export { findStyleAsync } from './findStyleAsync'
export { findVariableAsync } from './findVariableAsync'
export { focusNodeByIdAsync } from './focusNodeByIdAsync'
export { focusNodesAsync } from './focusNodesAsync'
export { findPositionAfter } from './findPositionAfter'
export { findPositionBefore } from './findPositionBefore'

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
export { hsbToColor } from './hsbToColor'

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
export { isValidVariant } from './isValidVariant'
export { isVariableAlias } from './isVariableAlias'
export { matchVariantName } from './matchVariantName'
export { midpoint } from './midpoint'

export { NodeStorage } from './NodeStorage'

export { parseVariantName } from './parseVariantName'
export { Payment } from './Payment'
export { pluginDataAdapter } from './pluginDataAdapter'

export { readWidgetSyncedState } from './readWidgetSyncedState'
export { recalcPositions } from './recalcPositions'
export { resolveColorValueAsync } from './resolveColorValueAsync'
export { resolveVariableValueAsync } from './resolveVariableValueAsync'
export { roundAlpha } from './roundAlpha'

export { setRelaunchCommand } from './setRelaunchCommand'
export { sortPositions } from './sortPositions'

export { toPaintPreview } from './toPaintPreview'
export { toSolidPaint } from './toSolidPaint'

export { uuid } from './uuid'

export { validateVariantNames } from './validateVariantNames'

export { walkNodeTree } from './walkNodeTree'

/* Types */

export type { TCollectInstancesOptions } from './collectInstances'
export type { TCollectWidgetNodesOptions } from './collectWidgetNodes'
export type { TColor, THsb } from './colorTypes'
export type { TLogger, TCreateLoggerOptions } from './createLogger'
export type {
  TCatalogCollection,
  TCatalogData,
  TCatalogItem,
  TCatalogLibrary,
  TCatalogStyle,
  TCatalogVariable,
  TCatalogVariableValue,
} from './catalogTypes'
export type { TScanCatalogOptions, TVariableCatalogOptions } from './VariableCatalog'
export type { TStyleOfType } from './findStyleAsync'
export type { TFocusNodesOptions } from './focusNodesAsync'
export type { TBoundVariableRef, TBoundVariableSource } from './getBoundVariableRefs'
export type { TImportComponentOrSetByKeyOptions, TImportByKeyOutcome } from './importComponentOrSetByKeyAsync'
export type { TIsLayerVisibleOptions } from './isLayerVisible'
export type { TMatchedVariantName } from './matchVariantName'
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
export type { TValidatedVariants, TVariantName } from './validateVariantNames'
export type { TPublishedRef, TVariableLookup } from './variableTypes'
export type { TInvalidVariant, TInvalidVariantReason } from './variantTypes'
export type { TWalkNodeTreeOptions, TWalkVerdict } from './walkNodeTree'
