import type { TColor, THsl } from './colorTypes'

/**
 * A color in 0–1 as HSL: the hue in degrees, the saturation and the lightness in 0–1.
 *
 * The hue is the hue of `colorToHsb`. A gray has no hue, so its hue is `0`.
 * Black and white have no saturation, so their saturation is `0`. The alpha stays as it is, clamped to 0–1.
 *
 * @example
 * colorToHsl({ r: 1, g: 0.5, b: 0, a: 1 })   // { h: 30, s: 1, l: 0.5, a: 1 }
 */
const colorToHsl = (color: TColor): THsl => {
  const { r, g, b } = color
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const l = (max + min) / 2

  let h = 0
  if (delta !== 0) {
    if (max === r) h = (60 * ((g - b) / delta) + 360) % 360
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
  }

  const s = delta === 0 ? 0 : Math.min(delta / (1 - Math.abs(2 * l - 1)), 1)

  return { h, s, l, a: Math.min(Math.max(color.a, 0), 1) }
}

export { colorToHsl }
