import type { TColor, THsl } from './colorTypes'

/**
 * A color in HSL as a color in 0–1.
 *
 * The hue wraps: `-30` and `390` are `330` and `30`. So a shift of the hue needs no clamp.
 * The saturation, the lightness and the alpha are clamped to 0–1.
 *
 * @example
 * hslToColor({ h: 30, s: 1, l: 0.5, a: 1 })   // { r: 1, g: 0.5, b: 0, a: 1 }
 */
const hslToColor = (hsl: THsl): TColor => {
  const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
  const h = ((hsl.h % 360) + 360) % 360
  const s = clamp(hsl.s)
  const l = clamp(hsl.l)
  const a = clamp(hsl.a)

  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - chroma / 2
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

export { hslToColor }
