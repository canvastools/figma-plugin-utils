import type { TPublishedRef } from './variableTypes'

import { isSamePublished } from './isSamePublished'

/** The style of Figma that has the given `type`. */
export type TStyleOfType<TType extends StyleType> = Extract<BaseStyle, { type: TType }>

/**
 * The style of the given type that a stored reference names in this file, or `null`. The id comes first, the key second.
 *
 * It uses the order and the key check of `findVariableAsync`, for the same reasons.
 * It also checks the type: a style of another type is not the style of the reference.
 *
 * **A refused style is expensive.** A test showed 255–490 ms for each refusal:
 * Figma caches nothing about a key that it did not import.
 * A refused variable costs that time only once.
 *
 * - Keep a cache in front of this helper when you resolve the same references more than once. Cache the refusals too.
 *
 * @example
 * const style = await findStyleAsync({ id: binding.id, key: binding.key }, 'TEXT')
 * // → TextStyle | null
 */
const findStyleAsync = async <TType extends StyleType>(
  ref: TPublishedRef,
  type: TType,
): Promise<TStyleOfType<TType> | null> => {
  const isWanted = (style: BaseStyle | null): style is TStyleOfType<TType> => style?.type === type

  const byId = ref.id ? await figma.getStyleByIdAsync(ref.id).catch(() => null) : null

  if (byId && isSamePublished(ref, byId) && isWanted(byId)) {
    return byId
  }

  if (!ref.key) {
    return null
  }

  const imported = await figma.importStyleByKeyAsync(ref.key).catch(() => null)

  return isWanted(imported) ? imported : null
}

export { findStyleAsync }
