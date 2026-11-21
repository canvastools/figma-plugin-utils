/**
 * The digits of a fractional position, in order: a position is a base-36 fraction.
 *
 * The package does not export it: it is the shared half of `midpoint` and `sortPositions`.
 */
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'

const BASE = ALPHABET.length

export { ALPHABET, BASE }
