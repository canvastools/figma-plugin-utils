import type { TInvalidVariantReason } from './variantTypes'

import { parseVariantName } from './parseVariantName'

export type TMatchedVariantName =
  | { status: 'parsed'; values: Record<string, string> }
  | { status: 'invalid'; reason: Exclude<TInvalidVariantReason, 'DUPLICATE'>; property: string | null }

/**
 * The property values of one variant, checked against the properties that its set declares.
 *
 * `parseVariantName` reads the pairs from the name. It stops where the string alone says nothing more.
 * Whether `Size` is a property of this set is a question about the set. This helper adds that check.
 *
 * Figma stores the state of a variant only in its name, and the name is editable text like each layer name.
 * A rename by hand leaves a component that still renders, and each tool that reads variants gives wrong results.
 * So the helper checks each value. There are three types of error, and each needs a different fix: see `TInvalidVariantReason`.
 * `property` names the wrong property, when there is one.
 *
 * Each declared key must be present. This also catches a name that repeats one property and omits another:
 * the repeat overwrites itself.
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
