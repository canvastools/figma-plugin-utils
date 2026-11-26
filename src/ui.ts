/**
 * `figma-plugin-utils/ui`: the helpers that work outside the plugin sandbox, for example in the UI of a plugin.
 *
 * They do not call `figma` and do not use the global types of `@figma/plugin-typings`.
 * So the UI imports them next to the DOM types, with no conflict and with no `skipLibCheck`.
 * The main entry exports each of them too.
 */

export { applyOpacity } from './applyOpacity'
export { colorToHex } from './colorToHex'
export { colorToHexAlpha } from './colorToHexAlpha'
export { colorToHsb } from './colorToHsb'
export { colorToHsl } from './colorToHsl'
export { createLogger } from './createLogger'
export { findPositionAfter } from './findPositionAfter'
export { findPositionBefore } from './findPositionBefore'
export { getGradientHandlePositions } from './getGradientHandlePositions'
export { getPropertyName } from './getPropertyName'
export { hexAlphaToColor } from './hexAlphaToColor'
export { hsbToColor } from './hsbToColor'
export { hsbToHsl } from './hsbToHsl'
export { hslToColor } from './hslToColor'
export { hslToHsb } from './hslToHsb'
export { isValidVariant } from './isValidVariant'
export { matchVariantName } from './matchVariantName'
export { midpoint } from './midpoint'
export { parseVariantName } from './parseVariantName'
export { recalcPositions } from './recalcPositions'
export { roundAlpha } from './roundAlpha'
export { sortPositions } from './sortPositions'
export { toPaintPreview } from './toPaintPreview'
export { toSolidPaint } from './toSolidPaint'
export { uuid } from './uuid'
export { validateVariantNames } from './validateVariantNames'

/* Types */

export type {
  TCatalogCollection,
  TCatalogData,
  TCatalogItem,
  TCatalogLibrary,
  TCatalogStyle,
  TCatalogVariable,
  TCatalogVariableValue,
} from './catalogTypes'
export type { TColor, THsb, THsl } from './colorTypes'
export type { TCreateLoggerOptions, TLogger } from './createLogger'
export type { TMatchedVariantName } from './matchVariantName'
export type { TGradientPreview, TPaintPreview, TPaintPreviewLayer } from './toPaintPreview'
export type { TValidatedVariants, TVariantName } from './validateVariantNames'
export type { TInvalidVariant, TInvalidVariantReason } from './variantTypes'
