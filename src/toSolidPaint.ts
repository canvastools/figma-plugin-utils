import type { RGBA, SolidPaint } from '@figma/plugin-typings/plugin-api-standalone'

/**
 * A color with an alpha as a solid paint: the channels go to `color`, the alpha goes to `opacity`.
 *
 * It is the reverse of `applyOpacity`. A color picker and a hex field give a color with an alpha.
 * Figma keeps the transparency of a solid paint in `opacity`, not in the color.
 *
 * The result keeps the other properties of `base`, for example `visible` and `blendMode`.
 * It has no `boundVariables`: the new color is a value, not a variable.
 * The opacity is a part of the color, so a new opacity alone also removes them.
 *
 * @example
 * toSolidPaint({ r: 1, g: 0, b: 0, a: 0.5 })          // { type: 'SOLID', color: { r: 1, g: 0, b: 0 }, opacity: 0.5 }
 * toSolidPaint(pickerColor, node.fills[0] as SolidPaint)   // the same paint with the new color
 */
const toSolidPaint = (color: RGBA, base?: SolidPaint): SolidPaint => {
  const { boundVariables: _, ...rest } = base ?? {}

  return { ...rest, type: 'SOLID', color: { r: color.r, g: color.g, b: color.b }, opacity: color.a }
}

export { toSolidPaint }
