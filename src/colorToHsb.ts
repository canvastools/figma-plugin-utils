import type { TColor, THsb } from './colorTypes'

/**
 * A color in 0–1 as HSB: the hue in degrees, the saturation and the brightness in 0–1.
 *
 * Use HSB to shift a color: the hue, the saturation and the brightness change one at a time. In RGB they do not.
 * A gray has no hue, so its hue is `0`. The alpha stays as it is, clamped to 0–1.
 *
 * @example
 * colorToHsb({ r: 1, g: 0.5, b: 0, a: 1 })   // { h: 30, s: 1, b: 1, a: 1 }
 */
const colorToHsb = (color: TColor): THsb => {
  const { r, g, b } = color
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) h = (60 * ((g - b) / delta) + 360) % 360
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
  }

  return { h, s: max === 0 ? 0 : delta / max, b: max, a: Math.min(Math.max(color.a, 0), 1) }
}

export { colorToHsb }
