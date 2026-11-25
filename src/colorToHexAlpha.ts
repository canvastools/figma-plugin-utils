import type { TColor } from './colorTypes'

import { colorToHex } from './colorToHex'
import { toHexByte } from './toHexByte'

/**
 * A color as eight hex digits, `#RRGGBBAA`. The alpha is last and always present.
 *
 * It writes eight digits also for an opaque color. So a stored color has one shape, and a read needs one parse.
 * `figma.util.solidPaint` takes the same string. The letters are upper case, as in `colorToHex`.
 *
 * - Multiply the `opacity` of a paint into the color with `applyOpacity` first.
 *   A paint keeps its alpha in `opacity`, not in the color.
 *
 * @example
 * colorToHexAlpha({ r: 0.592, g: 0.278, b: 1, a: 1 })   // '#9747FFFF'
 */
const colorToHexAlpha = (color: TColor): string => `${colorToHex(color)}${toHexByte(color.a)}`

export { colorToHexAlpha }
