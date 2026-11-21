import { ALPHABET } from './fractionalAlphabet'

/* A character outside the alphabet sorts by its char code, so old data still gets a stable order */
const compareFractionalPositions = (a: string, b: string): number => {
  const left = a.trim().toLowerCase()
  const right = b.trim().toLowerCase()

  const maxLength = Math.max(left.length, right.length)

  for (let index = 0; index < maxLength; index++) {
    const leftChar = left.charAt(index)
    const rightChar = right.charAt(index)

    if (leftChar === rightChar) continue

    const leftIndex = ALPHABET.indexOf(leftChar)
    const rightIndex = ALPHABET.indexOf(rightChar)

    const leftValue = leftIndex === -1 ? leftChar.charCodeAt(0) : leftIndex
    const rightValue = rightIndex === -1 ? rightChar.charCodeAt(0) : rightIndex

    if (leftValue !== rightValue) return leftValue - rightValue
  }

  return left.length - right.length
}

/**
 * Sorts a list by `position`. A map or a record does not keep an order.
 *
 * - Sort the values of a map or a record with this function before you show them.
 */
const sortPositions = <T extends { position: string }>(items: ReadonlyArray<T>): T[] =>
  [...items].sort((a, b) => compareFractionalPositions(a.position, b.position))

export { sortPositions }
