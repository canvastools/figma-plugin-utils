import { applyOpacity } from './applyOpacity'
import type { TColor } from './colorTypes'
import { createVariableLookup } from './createVariableLookup'
import { resolveVariableValueAsync } from './resolveVariableValueAsync'
import type { TResolveVariableValueOptions } from './resolveVariableValueAsync'

/**
 * A colour whose opacity is a variable of its own, as Figma stores one in
 * `valuesByMode`: `{ color, opacity }` in place of a colour, with `opacity` an
 * alias to a number variable. Absent from the plugin typings, and not the
 * `VARIABLE_EXPRESSION` a composed colour is — measured on its own.
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
 * The colour a variable's value draws as, out of whatever Figma keeps in its
 * place.
 *
 * - **A colour** is itself, its alpha made explicit.
 * - **A colour whose opacity is a variable** has that number read — down its
 *   own alias chain, in the default modes, as `resolveVariableValueAsync` reads
 *   — and multiplied into the colour's alpha. **The number is a percentage**:
 *   `72` was measured to draw as `0.72`, so reading it as written would clamp
 *   every translucent token to opaque without anything looking wrong. Whether it
 *   multiplies the colour's own alpha or replaces it was never told apart —
 *   every colour measured had an alpha of `1`, where the two agree — so
 *   multiplying is the reading right in every case measured, and it never makes
 *   a colour more opaque than its own value says.
 * - **Anything else** is `null`: a value Figma computes (`VARIABLE_EXPRESSION`),
 *   an opacity whose chain does not end in a number, a value of another type.
 *   Leaving it out is the only safe answer — the alternative is inventing a
 *   colour and calling it the variable's.
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
