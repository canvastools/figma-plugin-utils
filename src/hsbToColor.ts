import type { TColor, THsb } from './colorTypes'

/**
 * A color in HSB as a color in 0–1.
 *
 * The hue wraps: `-30` and `390` are `330` and `30`. So a shift of the hue needs no clamp.
 * The saturation, the brightness and the alpha are clamped to 0–1.
 *
 * @example
 * hsbToColor({ h: 30, s: 1, b: 1, a: 1 })   // { r: 1, g: 0.5, b: 0, a: 1 }
 */
const hsbToColor = (hsb: THsb): TColor => {
  const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
  const h = ((hsb.h % 360) + 360) % 360
  const s = clamp(hsb.s)
  const v = clamp(hsb.b)
  const a = clamp(hsb.a)

  const chroma = v * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - chroma
  const sector = Math.floor(h / 60)
  const [r, g, b] = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x],
  ][sector] as [number, number, number]

  return { r: r + m, g: g + m, b: b + m, a }
}

export { hsbToColor }
