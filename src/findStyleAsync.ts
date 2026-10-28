import { isSamePublished } from './findVariableAsync'
import type { TPublishedRef } from './findVariableAsync'

/* A style by the `type` Figma gives it */
export type TStyleOfType = {
  PAINT: PaintStyle
  TEXT: TextStyle
  EFFECT: EffectStyle
  GRID: GridStyle
}

/**
 * The style of the given type a stored reference names here — by its id first,
 * by its key second — or `null`.
 *
 * The same order and the same key check as `findVariableAsync`, for the same
 * reasons, and one more: a style is only the style asked for if Figma agrees
 * about its type, so one of another type is no answer.
 *
 * **A refused style is expensive.** Measured at 255–490 ms every time — Figma
 * caches nothing about a key it could not import — where a refused variable
 * costs that once. A caller resolving the same references more than once keeps
 * its own cache in front of this, refusals included.
 *
 * @example
 * const style = await findStyleAsync({ id: binding.id, key: binding.key }, 'TEXT')
 * // → TextStyle | null
 */
const findStyleAsync = async <TType extends StyleType>(
  ref: TPublishedRef,
  type: TType,
): Promise<TStyleOfType[TType] | null> => {
  const isWanted = (style: BaseStyle | null): style is TStyleOfType[TType] => style?.type === type

  const byId = await figma.getStyleByIdAsync(ref.id).catch(() => null)

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
