import { midpoint } from './midpoint'

/**
 * A position after `prev`, for an item at the end of the list. `null` gives a position for an empty list.
 *
 * @example
 * const position = findPositionAfter(items.at(-1)?.position ?? null)
 */
const findPositionAfter = (prev: string | null): string => midpoint(prev, null)

export { findPositionAfter }
