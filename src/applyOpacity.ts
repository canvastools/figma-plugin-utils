import type { RGB, RGBA } from '@figma/plugin-typings/plugin-api-standalone'

import type { TColor } from './colorTypes'

/**
 * A color with an opacity multiplied into its alpha.
 *
 * Figma keeps the transparency of a paint in two places: `opacity` on the paint and the alpha of the color.
 * A gradient stop and the value of a variable have an alpha. The color of a solid paint does not.
 * Figma draws the product of the two. A swatch, a hex string and a comparison need that product.
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
