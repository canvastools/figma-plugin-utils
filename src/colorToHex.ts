import { toHexByte } from './toHexByte'

/**
 * A colour as six hex digits, `#RRGGBB` — the alpha, if there is one, left out.
 *
 * Upper case, always: a colour is read in stored data and typed back into a hex
 * field, and the same colour must not come out in two spellings depending on
 * which helper wrote it last. `colorToHexAlpha` is the same rule with the alpha.
 *
 * @example
 * colorToHex({ r: 0.592, g: 0.278, b: 1 })   // '#9747FF'
 */
const colorToHex = (color: { r: number; g: number; b: number }): string =>
  `#${toHexByte(color.r)}${toHexByte(color.g)}${toHexByte(color.b)}`

export { colorToHex }
