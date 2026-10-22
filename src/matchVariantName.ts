import { parseVariantName } from './parseVariantName'

/**
 * Why a variant's name says no state of its own.
 *
 * - `INVALID_NAME` — not a property string at all
 * - `UNKNOWN_PROPERTY` — names a property the set does not declare
 * - `INCOMPLETE` — leaves out a property the set declares
 * - `DUPLICATE` — says a state another variant of the set already says
 *
 * The first three are about one name, and `matchVariantName` answers them; the
 * fourth is about two, and only `validateVariantNames` can.
 */
export type TInvalidVariantReason = 'INVALID_NAME' | 'UNKNOWN_PROPERTY' | 'INCOMPLETE' | 'DUPLICATE'

export type TMatchedVariantName =
  | { status: 'parsed'; values: Record<string, string> }
  | { status: 'invalid'; reason: Exclude<TInvalidVariantReason, 'DUPLICATE'>; property: string | null }

/**
 * The property values of one variant, checked against the properties its set
 * declares.
 *
 * Reading the pairs out of the name is `parseVariantName`, and it stops where
 * the string stops meaning anything on its own: whether `Size` is a property of
 * *this* set is a question about the set, and that check is what this adds.
 *
 * Figma stores the state of a variant nowhere but in its name, and the name is
 * editable text like any other layer name. Renaming it by hand leaves a
 * component that still renders while every tool reading variants starts lying,
 * so nothing is trusted until it is checked. Three ways it can go wrong, told
 * apart because they mean different things to whoever has to fix them — see
 * `TInvalidVariantReason`. `property` names the one at fault, where there is one.
 *
 * Every declared key has to be present, which also catches a name that repeats
 * one property and leaves out another: the repeat overwrites itself.
 *
 * @example
 * matchVariantName('Size=M, Type=Primary', ['Size', 'Type'])
 * // → { status: 'parsed', values: { Size: 'M', Type: 'Primary' } }
 *
 * matchVariantName('Size=M', ['Size', 'Type'])
 * // → { status: 'invalid', reason: 'INCOMPLETE', property: 'Type' }
 */
const matchVariantName = (name: string, variantKeys: readonly string[]): TMatchedVariantName => {
  const values = parseVariantName(name)

  if (!values) {
    return { status: 'invalid', reason: 'INVALID_NAME', property: null }
  }

  const unknownKey = Object.keys(values).find((key) => !variantKeys.includes(key))

  if (unknownKey !== undefined) {
    return { status: 'invalid', reason: 'UNKNOWN_PROPERTY', property: unknownKey }
  }

  const missingKey = variantKeys.find((key) => !(key in values))

  if (missingKey !== undefined) {
    return { status: 'invalid', reason: 'INCOMPLETE', property: missingKey }
  }

  return { status: 'parsed', values }
}

export { matchVariantName }
