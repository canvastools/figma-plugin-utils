import type { TColor } from './colorTypes'

/**
 * A hex color of six or eight digits as a color in 0–1, or `null` for other strings.
 *
 * Six digits are opaque. The `#` is optional, and the case of the letters is not important.
 * The helper refuses the short forms of three and four digits and does not guess.
 * `colorToHexAlpha` writes the colors that a plugin stores. A short form in stored data shows that other code wrote there.
 *
 * @example
 * hexAlphaToColor('#9747FF80')   // { r: 0.592…, g: 0.278…, b: 1, a: 0.501… }
 * hexAlphaToColor('9747ff')      // { r: 0.592…, g: 0.278…, b: 1, a: 1 }
 * hexAlphaToColor('#FFF')        // null
 */
const hexAlphaToColor = (hex: string): TColor | null => {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex

  if (!/^([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(clean)) {
    return null
  }

  const channel = (index: number): number => parseInt(clean.slice(index, index + 2), 16) / 255

  return { r: channel(0), g: channel(2), b: channel(4), a: clean.length === 8 ? channel(6) : 1 }
}

export { hexAlphaToColor }
