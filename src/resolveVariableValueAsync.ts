import { createVariableLookup } from './createVariableLookup'
import type { TVariableLookup } from './createVariableLookup'
import { isVariableAlias } from './isVariableAlias'

export type TResolveVariableValueOptions = {
  /* Where the chain's variables and collections are found. A fresh one, asking the API, by default */
  lookup?: TVariableLookup
  /* How many aliases are followed before giving up. 8 by default */
  maxHops?: number
}

/**
 * How far an alias chain is followed.
 *
 * A design system three tiers deep is the ordinary case, and eight is far past
 * any of them. A cap rather than a visited set: a cycle ends here without a
 * `Set` to carry, and a chain longer than this is not a value anybody meant.
 */
const MAX_ALIAS_HOPS = 8

/**
 * What a variable is worth in the mode its collection opens in — every alias on
 * the way followed, each in its own collection's default mode.
 *
 * **Without a node.** `resolveForConsumer` answers the same question for a
 * node, in the modes that node is in; a plugin about to bind a variable to
 * something it has not drawn yet has no node to ask with, and this is what is
 * left. The default mode is the one every consumer resolves to unless something
 * says otherwise, so it is the honest single answer for a variable that has one
 * value per mode.
 *
 * The value at the end of the chain is answered as Figma keeps it — a number, a
 * string, a boolean, a colour, or anything else the API stores in its place,
 * such as a colour whose opacity is a variable of its own (see
 * `resolveColorValueAsync`). `null` when the chain cannot be finished: a
 * variable or a collection that does not resolve, a mode with no value, a chain
 * past `maxHops`.
 *
 * @example
 * const value = await resolveVariableValueAsync(variable)
 *
 * if (typeof value === 'number') field.value = value
 */
const resolveVariableValueAsync = async (
  variable: Variable,
  options: TResolveVariableValueOptions = {},
): Promise<VariableValue | null> => {
  const lookup = options.lookup ?? createVariableLookup()
  const maxHops = options.maxHops ?? MAX_ALIAS_HOPS

  let current: Variable | null = variable

  for (let hop = 0; current && hop < maxHops; hop += 1) {
    const collection = await lookup.collectionAsync(current.variableCollectionId)

    const value: VariableValue | undefined = collection ? current.valuesByMode[collection.defaultModeId] : undefined

    if (value === undefined) {
      return null
    }

    if (!isVariableAlias(value)) {
      return value
    }

    current = await lookup.variableAsync(value.id)
  }

  return null
}

export { resolveVariableValueAsync }
