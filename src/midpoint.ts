import { ALPHABET, BASE } from './fractionalAlphabet'

/**
 * A position between `a` and `b`. `null` is an end of the list: `a` is the start, and `b` is the end.
 *
 * An item keeps its place in a list with a `position` string, not a number index.
 * So an insert or a move changes one row and does not number the list again.
 * A position is a base-36 fraction in the alphabet `0-9a-z` (`'m'` ≈ 0.61…). Positions compare as strings.
 * A new position does not end in `'0'`. So a smaller position is always available, and an insert between two neighbors always
 * has room.
 *
 * Old data can have a `b` that is `a` with zeros at the end, or only zeros. No position fits between or below.
 * Then the result is `''`, which sorts before each other position, or the common prefix.
 *
 * @example
 * midpoint('a', 'c')   // 'b'
 * midpoint(null, null) // 'm'
 */
const midpoint = (a: string | null, b: string | null): string => {
  if (!a && !b) return 'm'

  const toIndices = (s: string): number[] =>
    s
      .toLowerCase()
      .split('')
      .map((ch) => {
        const i = ALPHABET.indexOf(ch)
        return i === -1 ? BASE - 1 : i
      })

  const toString = (arr: number[]) => arr.map((i) => ALPHABET[i]).join('')

  const left = a ? toIndices(a) : []
  const right = b ? toIndices(b) : []

  const output: number[] = []
  let i = 0
  /* After a digit below the digit of `b`, any later digit keeps the result below `b` */
  let bOpen = !b

  for (;;) {
    const l = i < left.length ? left[i] : 0
    const r = bOpen ? BASE : i < right.length ? right[i] : -1

    /* `b` ended while it was still a bound: the old data of the JSDoc */
    if (r === -1) {
      return !a ? '' : toString(output)
    }

    if (r - l > 1) {
      output.push(Math.floor((l + r) / 2))
      return toString(output)
    }

    output.push(l)
    if (r === l + 1) bOpen = true
    i++
  }
}

export { midpoint }
