/**
 * Fractional indexing for ordered lists.
 *
 * An item keeps its place in a list through a `position` string rather than a
 * numeric index, so inserting or moving one item rewrites one row instead of
 * renumbering the list. Positions are read as base-36 fractions over the
 * alphabet `0-9a-z` (`'m'` ≈ 0.61…) and compared lexicographically.
 *
 * Generated values never end in `'0'`, so a smaller position can always be
 * derived later — inserting between two neighbours never runs out of room.
 */

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const BASE = ALPHABET.length

/* Generating positions */

/**
 * A position strictly between `a` and `b`, where `null` means the list boundary
 * (`a` = 0, `b` = 1).
 */
const midpoint = (a: string | null, b: string | null): string => {
  if (!a && !b) return 'm' /** single item */

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
  /** Once a digit strictly below b's digit is emitted, the upper bound is open */
  let bOpen = !b

  for (;;) {
    const l = i < left.length ? left[i] : 0
    const r = bOpen ? BASE : i < right.length ? right[i] : -1

    /** b exhausted while still bounding: b is `a` plus trailing zeros (or all
     * zeros) — nothing fits strictly between/below. Only reachable with
     * positions this module never generates (legacy data). Degrade to ''
     * (sorts before any non-empty position) or to the common prefix. */
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

/** A position after `prev` — the end of the list when `prev` is `null`. */
const findPositionAfter = (prev: string | null): string => midpoint(prev, null)

/** A position before `next` — the start of the list when `next` is `null`. */
const findPositionBefore = (next: string | null): string => midpoint(null, next)

/* Reading positions */

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
 * List order by `position`. A map or a record gives no order guarantee of its
 * own, so anything read out of one is sorted through here before it is shown.
 */
const sortPositions = <T extends { position: string }>(items: ReadonlyArray<T>): T[] =>
  [...items].sort((a, b) => compareFractionalPositions(a.position, b.position))

/* Reordering */

/**
 * Reassign positions after a drag-and-drop: `updatedOrder` is the list of ids
 * in their new order, `currentOrder` the order they had.
 *
 * Returns `items` untouched — the same reference — when nothing moved, and when
 * `updatedOrder` is not a permutation of the current ids. An order built from
 * outdated client state would otherwise silently drop the items missing from
 * it; keeping the current state lets the caller return the full dataset and the
 * client re-sync.
 */
const recalcPositions = <T extends { id: string; position: string }>(
  items: T[],
  currentOrder: string[],
  updatedOrder: string[],
): T[] => {
  if (currentOrder.length === updatedOrder.length && currentOrder.every((id, idx) => id === updatedOrder[idx])) {
    return items
  }

  const updatedIds = new Set(updatedOrder)
  if (updatedIds.size !== items.length || !items.every((item) => updatedIds.has(item.id))) {
    return items
  }

  const idToItem = new Map(items.map((i) => [i.id, i]))

  let previousPosition: string | null = null
  const reassigned: T[] = []

  for (const id of updatedOrder) {
    const baseItem = idToItem.get(id)
    if (!baseItem) continue
    const newPosition = midpoint(previousPosition, null)
    reassigned.push({ ...baseItem, position: newPosition })
    previousPosition = newPosition
  }

  return reassigned
}

export { findPositionAfter, findPositionBefore, midpoint, recalcPositions, sortPositions }
