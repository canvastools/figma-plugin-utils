import type { TInvalidVariantReason } from './matchVariantName'

import { matchVariantName } from './matchVariantName'
import { parseVariantName } from './parseVariantName'

/* A variant as this check needs it: which one, and what it is called */
export type TVariantName = { id: string; name: string }

export type TInvalidVariant = {
  variantComponentId: string
  variantName: string
  reason: TInvalidVariantReason
  /* The property at fault, for `UNKNOWN_PROPERTY` and `INCOMPLETE`. Null otherwise */
  property: string | null
  /* For `DUPLICATE` — the id of the variant that said these values first. Null otherwise */
  duplicateOfId: string | null
}

export type TValidatedVariants = {
  /* The variants whose names say a state of their own, in the order they came */
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
 * Which variants of a set name a state, and why the others do not.
 *
 * Pure — the names and the keys are passed in — so a caller that has read the
 * set already pays nothing more; `findInvalidVariants` reads them for a caller
 * that has not.
 *
 * **A set declaring no variant properties is checked against its own names.**
 * A set Figma considers broken — two variants naming one state, a name that is
 * not a property string — declares no variant properties to a plugin (measured
 * on one of each: no `VARIANT` definition came back).
 * Checked against nothing, every name mentions a property the set does not
 * declare, and the reason the set is broken is lost under a reason that is true
 * of every variant of it. So the keys are taken from the names that parse, and
 * each name is checked against the others.
 *
 * Duplicates are found among the names that parsed, on their values, in the
 * order the variants came: the first one to say a state keeps it.
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
