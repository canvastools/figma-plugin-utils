/**
 * The reason why the name of a variant gives no state of its own.
 *
 * - `INVALID_NAME`: the name is not a property string.
 * - `UNKNOWN_PROPERTY`: the name has a property that the set does not declare.
 * - `INCOMPLETE`: the name does not have a property that the set declares.
 * - `DUPLICATE`: the name gives the state of another variant of the set.
 *
 * The first three reasons are about one name, and `matchVariantName` finds them.
 * The fourth reason is about two names, and only `validateVariantNames` finds it.
 */
export type TInvalidVariantReason = 'INVALID_NAME' | 'UNKNOWN_PROPERTY' | 'INCOMPLETE' | 'DUPLICATE'

/** A variant with a name that gives no state of its own, and the reason. */
export type TInvalidVariant = {
  variantComponentId: string
  variantName: string
  reason: TInvalidVariantReason
  /** The wrong property for `UNKNOWN_PROPERTY` and `INCOMPLETE`, else `null`. */
  property: string | null
  /** For `DUPLICATE`, the id of the first variant with the same values, else `null`. */
  duplicateOfId: string | null
}
