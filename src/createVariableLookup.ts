/**
 * Where a reader of variable values finds the variables and collections it
 * passes through.
 *
 * Both answer `null` rather than throw — for an id this file has never seen, and
 * for one the API refused.
 */
export type TVariableLookup = {
  collectionAsync: (id: string) => Promise<VariableCollection | null>
  variableAsync: (id: string) => Promise<Variable | null>
}

/**
 * A lookup of variables and collections that asks the API only for what it was
 * not handed.
 *
 * **What is already in hand is not asked for again.** A reader that has just
 * listed the local variables and collections — two calls — holds every default
 * mode and every local alias hop; asking Figma again per value is a call across
 * the sandbox boundary per variable at least, and three per alias. So the lists
 * seed it, and only what they do not hold — a library variable an alias
 * reaches, the collection of an imported one — goes to the API. Kept for as long
 * as the lookup is: a reader of many variables of one collection asks for that
 * collection once.
 *
 * **An answer is kept, a refusal is not.** A variable that is not here yet — one
 * of a library still being imported — may resolve a moment later, so `null` is
 * asked again the next time rather than remembered.
 *
 * Nothing is shared between two lookups: each holds its own maps, so how long an
 * answer lives is decided by whoever created it.
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
