import type { TColor } from './colorTypes'

/**
 * A hex colour of six or eight digits as a colour in 0–1, or `null` for
 * anything else.
 *
 * Six digits are opaque. The `#` is optional and the case is not read. Three-
 * and four-digit shorthands are refused rather than guessed at: the colours a
 * plugin stores are written by `colorToHexAlpha`, and a short form in stored
 * data is a sign of something else having written there.
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
