import { toHexByte } from './toHexByte'

/**
 * A color as six hex digits, `#RRGGBB`, without the alpha.
 *
 * The letters are always upper case. A plugin reads a color from stored data and writes it back into a hex field.
 * The same color must have one spelling, from each helper. `colorToHexAlpha` has the same rule with the alpha.
 *
 * @example
 * colorToHex({ r: 0.592, g: 0.278, b: 1 })   // '#9747FF'
 */
const colorToHex = (color: { r: number; g: number; b: number }): string =>
  `#${toHexByte(color.r)}${toHexByte(color.g)}${toHexByte(color.b)}`

export { colorToHex }
