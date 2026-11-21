import { midpoint } from './midpoint'

/**
 * Gives new positions after a drag and drop. `updatedOrder` is the new order of the ids, `currentOrder` is the old order.
 *
 * It returns `items` unchanged, the same reference, when no item moved.
 * It also returns `items` when `updatedOrder` is not a permutation of the current ids.
 * An order from old data can omit items, and a new order without them loses them.
 * The caller then sends the current items again.
 *
 * @example
 * const reordered = recalcPositions(items, currentIds, draggedIds)
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

export { recalcPositions }
