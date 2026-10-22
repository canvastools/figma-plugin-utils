import type { TColor } from './colorTypes'

import { colorToHex } from './colorToHex'
import { toHexByte } from './toHexByte'

/**
 * A colour as eight hex digits, `#RRGGBBAA` — the alpha last and always written.
 *
 * Always eight rather than six for an opaque colour, so that a stored colour has
 * one shape and the read back is one parse — and `figma.util.solidPaint` takes
 * the same string back. Upper case, as `colorToHex`.
 *
 * A paint keeps its alpha in `opacity` rather than in the colour; fold it in
 * with `applyOpacity` first.
 *
 * @example
 * colorToHexAlpha({ r: 0.592, g: 0.278, b: 1, a: 1 })   // '#9747FFFF'
 */
const colorToHexAlpha = (color: TColor): string => `${colorToHex(color)}${toHexByte(color.a)}`

export { colorToHexAlpha }
