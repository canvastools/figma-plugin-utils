import type { TColor } from './colorTypes'

/**
 * A colour with an opacity folded into its alpha.
 *
 * Figma keeps a paint's transparency in two places: `opacity` on the paint, and
 * the alpha of the colour itself where the colour has one — a gradient stop and
 * a variable's value do, a solid paint's colour does not. What is drawn is the
 * product of the two, and that product is the colour anybody outside the paint
 * means: a swatch, a hex string, a comparison.
 *
 * @example
 * applyOpacity(paint.color, paint.opacity ?? 1)
 * applyOpacity(stop.color, paint.opacity ?? 1)
 */
const applyOpacity = (color: RGB | RGBA, opacity = 1): TColor => ({
  r: color.r,
  g: color.g,
  b: color.b,
  a: ('a' in color ? color.a : 1) * opacity,
})

export { applyOpacity }
