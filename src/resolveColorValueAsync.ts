import { applyOpacity } from './applyOpacity'
import type { TColor } from './colorTypes'
import { createVariableLookup } from './createVariableLookup'
import { resolveVariableValueAsync } from './resolveVariableValueAsync'
import type { TResolveVariableValueOptions } from './resolveVariableValueAsync'

/**
 * A color with a variable for its opacity, as Figma stores it in `valuesByMode`.
 * The value is `{ color, opacity }` in place of a color, and `opacity` is an alias to a number variable.
 * The plugin typings do not have this shape. It is not a `VARIABLE_EXPRESSION` either: a test in Figma showed it.
 */
type TColorWithOpacity = { color: RGBA; opacity: VariableAlias | number }

const isColorWithOpacity = (value: unknown): value is TColorWithOpacity =>
  typeof value === 'object' &&
  value !== null &&
  'color' in value &&
  'opacity' in value &&
  typeof (value as { color: unknown }).color === 'object'

const isColor = (value: unknown): value is RGB | RGBA =>
  typeof value === 'object' && value !== null && 'r' in value && 'g' in value && 'b' in value

/**
 * The color that the value of a variable draws, from the data that Figma keeps for it.
 *
 * - **A color** gives itself, with an explicit alpha.
 * - **A color with a variable opacity** reads that number along its alias chain, in the modes of `modes`, else in the default
 *   modes.
 *   It reads as `resolveVariableValueAsync` does. The number then multiplies the alpha of the color.
 * - **The number is a percent.** A test in Figma showed that `72` draws as `0.72`.
 *   A read of the number as it is makes each translucent token opaque, and nothing shows the error.
 * - **The multiplication is a choice.** The tests did not show if the number multiplies the alpha or replaces it.
 *   Each tested color had an alpha of `1`, where the two give the same result.
 *   A multiplication matches each test and does not make a color more opaque than its value.
 * - **Other values give `null`**: a computed value (`VARIABLE_EXPRESSION`), an opacity that does not end in a number, a value
 *   of another type.
 *   `null` is the only safe answer. The other answer is a color that the variable does not have.
 *
 * @example
 * const value = await resolveVariableValueAsync(variable, { lookup })
 * const color = await resolveColorValueAsync(value, { lookup })
 */
const resolveColorValueAsync = async (
  value: VariableValue | null,
  options: TResolveVariableValueOptions = {},
): Promise<TColor | null> => {
  if (isColorWithOpacity(value)) {
    const lookup = options.lookup ?? createVariableLookup()

    const opacity =
      typeof value.opacity === 'number'
        ? value.opacity
        : await lookup
            .variableAsync(value.opacity.id)
            .then((variable) => (variable ? resolveVariableValueAsync(variable, { ...options, lookup }) : null))

    if (typeof opacity !== 'number') {
      return null
    }

    return applyOpacity(value.color, Math.min(Math.max(opacity / 100, 0), 1))
  }

  return isColor(value) ? applyOpacity(value) : null
}

export { resolveColorValueAsync }
