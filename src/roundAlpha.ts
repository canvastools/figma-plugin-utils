/**
 * An alpha with two decimals: a whole percent.
 *
 * An alpha from two hex digits is a multiple of 1/255, never a round number.
 * A person types a percent. After the round, the two values agree: `0.5` and `128 / 255` are both 50%.
 *
 * @example
 * roundAlpha(128 / 255)   // 0.5
 */
const roundAlpha = (alpha: number): number => Math.round(alpha * 100) / 100

export { roundAlpha }
