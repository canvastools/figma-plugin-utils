/**
 * An alpha rounded to two decimals — a whole percentage.
 *
 * An alpha read back from two hex digits is a 255th, never a round number, so
 * comparing it with one a person typed as a percentage asks the two to agree on
 * what they can both say: `0.5` and `128 / 255` are both 50%.
 *
 * @example
 * roundAlpha(128 / 255)   // 0.5
 */
const roundAlpha = (alpha: number): number => Math.round(alpha * 100) / 100

export { roundAlpha }
