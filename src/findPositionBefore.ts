import { midpoint } from './midpoint'

/**
 * A position before `next`, for an item at the start of the list. `null` gives a position for an empty list.
 *
 * @example
 * const position = findPositionBefore(items[0]?.position ?? null)
 */
const findPositionBefore = (next: string | null): string => midpoint(null, next)

export { findPositionBefore }
