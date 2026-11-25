import type { TVariableLookup } from './variableTypes'

/**
 * A lookup of variables and collections. It asks the API only for the items that it did not get.
 *
 * **The lookup does not ask again for an item that it has.**
 * A reader that listed the local variables and collections (two calls) has each default mode and each local alias.
 * A new question for each value is at least one call across the sandbox boundary for each variable, and three for each alias.
 * So the lists fill the lookup. Only the other items go to the API:
 * a library variable that an alias reaches, the collection of an imported variable.
 * The lookup keeps them while it exists. A reader of many variables of one collection asks for that collection once.
 *
 * **The lookup keeps an answer and does not keep a refusal.** A variable of a library that Figma still imports can resolve a
 * moment later.
 * So the lookup asks again for a `null` the next time.
 *
 * Two lookups share nothing: each has its own maps. So the creator of a lookup decides how long an answer lives.
 *
 * @example
 * const [variables, collections] = await Promise.all([
 *   figma.variables.getLocalVariablesAsync(),
 *   figma.variables.getLocalVariableCollectionsAsync(),
 * ])
 *
 * const lookup = createVariableLookup(variables, collections)
 */
const createVariableLookup = (
  variables: readonly Variable[] = [],
  collections: readonly VariableCollection[] = [],
): TVariableLookup => {
  const knownVariables = new Map(variables.map((variable) => [variable.id, variable] as const))
  const knownCollections = new Map(collections.map((collection) => [collection.id, collection] as const))

  return {
    collectionAsync: async (id) => {
      const found = knownCollections.get(id) ?? (await figma.variables.getVariableCollectionByIdAsync(id).catch(() => null))

      if (found) {
        knownCollections.set(id, found)
      }

      return found
    },
    variableAsync: async (id) => {
      const found = knownVariables.get(id) ?? (await figma.variables.getVariableByIdAsync(id).catch(() => null))

      if (found) {
        knownVariables.set(id, found)
      }

      return found
    },
  }
}

export { createVariableLookup }
