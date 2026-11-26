import { colorToHsb } from './colorToHsb'
import type { THsb, THsl } from './colorTypes'
import { hslToColor } from './hslToColor'

/**
 * A color in HSL as a color in HSB, with the same hue.
 *
 * A gray has no hue and black has no saturation in a color of 0–1, so a pass through `TColor` loses them.
 * This helper keeps the hue of `hsl`, and the saturation of `hsl` for black.
 * Use it when a color picker changes the model of its value, so the handles do not move.
 *
 * @example
 * hslToHsb({ h: 200, s: 0.8, l: 0, a: 1 })   // { h: 200, s: 0.8, b: 0, a: 1 }
 */
const hslToHsb = (hsl: THsl): THsb => {
  const hsb = colorToHsb(hslToColor(hsl))
  return { ...hsb, h: hsl.h, s: hsb.b === 0 ? hsl.s : hsb.s }
}

export { hslToHsb }
