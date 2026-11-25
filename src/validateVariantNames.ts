import type { TInvalidVariant } from './variantTypes'

import { matchVariantName } from './matchVariantName'
import { parseVariantName } from './parseVariantName'

/** A variant as this check needs it: its id and its name. */
export type TVariantName = { id: string; name: string }

export type TValidatedVariants = {
  /** The variants with a name that gives a state of its own, in their order. */
  valid: { id: string; name: string; values: Record<string, string> }[]
  invalid: TInvalidVariant[]
}

/* The values a name says, as one string — sorted by key, joined by a NUL a typed value cannot hold */
const toValuesKey = (values: Record<string, string>): string =>
  Object.keys(values)
    .sort()
    .map((key) => `${key}=${values[key]}`)
    .join('\u0000')

/* Every key any name that parses carries, in the order they first appear */
const collectNameKeys = (variants: readonly TVariantName[]): string[] => {
  const keys = new Set<string>()

  variants.forEach((variant) => {
    const values = parseVariantName(variant.name)

    if (values) {
      Object.keys(values).forEach((key) => keys.add(key))
    }
  })

  return [...keys]
}

/**
 * Which variants of a set name a state, and the reason for each other variant.
 *
 * It is pure: the caller gives the names and the keys. So a caller that already read the set pays nothing more.
 * `findInvalidVariants` reads them for a caller that did not.
 *
 * **A set that declares no variant properties is checked against its own names.**
 * Figma breaks a set when two variants name one state or a name is not a property string.
 * Such a set declares no variant properties to a plugin. A test in Figma showed no `VARIANT` definition for each case.
 * A check against no keys says that each name has an undeclared property.
 * That reason is true for each variant and hides the real reason.
 * So the helper takes the keys from the names that parse, and checks each name against the others.
 *
 * The helper finds duplicates among the parsed names, by their values, in the order of the variants.
 * The first variant with a state keeps it.
 *
 * @example
 * const { valid, invalid } = validateVariantNames(
 *   set.children.map((variant) => ({ id: variant.id, name: variant.name })),
 *   variantKeys,
 * )
 */
const validateVariantNames = (variants: readonly TVariantName[], variantKeys: readonly string[]): TValidatedVariants => {
  const keys = variantKeys.length ? variantKeys : collectNameKeys(variants)

  const valid: TValidatedVariants['valid'] = []
  const invalid: TInvalidVariant[] = []

  /* Values key → the variant that said that state first */
  const claimedBy = new Map<string, string>()

  variants.forEach((variant) => {
    const matched = matchVariantName(variant.name, keys)

    if (matched.status === 'invalid') {
      invalid.push({
        variantComponentId: variant.id,
        variantName: variant.name,
        reason: matched.reason,
        property: matched.property,
        duplicateOfId: null,
      })

      return
    }

    const valuesKey = toValuesKey(matched.values)
    const claimedById = claimedBy.get(valuesKey)

    if (claimedById !== undefined) {
      invalid.push({
        variantComponentId: variant.id,
        variantName: variant.name,
        reason: 'DUPLICATE',
        property: null,
        duplicateOfId: claimedById,
      })

      return
    }

    claimedBy.set(valuesKey, variant.id)
    valid.push({ id: variant.id, name: variant.name, values: matched.values })
  })

  return { valid, invalid }
}

export { validateVariantNames }
