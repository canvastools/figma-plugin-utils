import { colorToHsl } from './colorToHsl'
import type { THsb, THsl } from './colorTypes'
import { hsbToColor } from './hsbToColor'

/**
 * A color in HSB as a color in HSL, with the same hue.
 *
 * A gray has no hue in a color of 0–1, so a pass through `TColor` loses it. This helper keeps the hue of `hsb`.
 * Use it when a color picker changes the model of its value, so the handle of the hue does not move.
 *
 * @example
 * hsbToHsl({ h: 200, s: 0, b: 0.5, a: 1 })   // { h: 200, s: 0, l: 0.5, a: 1 }
 */
const hsbToHsl = (hsb: THsb): THsl => ({ ...colorToHsl(hsbToColor(hsb)), h: hsb.h })

export { hsbToHsl }
