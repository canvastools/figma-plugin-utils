/* What one import produced. `empty` is "no such thing", `failed` is "could not ask" */
export type TImportByKeyOutcome =
  { status: 'found'; node: ComponentNode | ComponentSetNode } | { status: 'empty' } | { status: 'failed'; message: string }

/**
 * Imports a published component or component set by its key, for the type that the key has.
 *
 * Figma has one import call for each node type and does not say which type a key has. So the helper tries both.
 * `preferType` sets only which call comes first.
 *
 * A designer who adds variants to a component replaces it with a set that holds it. A key from before or after that change means the same component.
 * With one call only, the helper reports this usual case as a library that is not available.
 * The second call costs nothing when the first call answers, and that is the usual result.
 *
 * Figma rejects an import for "no published component with that key" and for "the request failed". It does not say which.
 * So a rejection shows only that the key did not work now. It does not show that the component is gone.
 *
 * The caller tells the two cases apart. So `empty` and `failed` are separate results, not one `null`.
 * `failed` holds the first rejection: the second call fails for its own reasons.
 *
 * A local component that is not published has a key, but an import by that key fails.
 *
 * - Search the document first.
 *
 * The helper calls `onApiCall` before each try. A caller uses it to count or limit the most expensive call of a plugin.
 *
 * @example
 * const outcome = await importComponentOrSetByKeyAsync(key, 'COMPONENT_SET')
 *
 * if (outcome.status === 'found') use(outcome.node)
 */
const importComponentOrSetByKeyAsync = async (
  key: string,
  preferType: NodeType = 'COMPONENT',
  options: { onApiCall?: () => void } = {},
): Promise<TImportByKeyOutcome> => {
  const imports =
    preferType === 'COMPONENT_SET'
      ? [() => figma.importComponentSetByKeyAsync(key), () => figma.importComponentByKeyAsync(key)]
      : [() => figma.importComponentByKeyAsync(key), () => figma.importComponentSetByKeyAsync(key)]

  let failureMessage: string | undefined

  for (const importAsync of imports) {
    options.onApiCall?.()

    try {
      const node = await importAsync()

      if (node) {
        return { status: 'found', node }
      }
    } catch (error) {
      failureMessage = failureMessage ?? String(error)
    }
  }

  return failureMessage === undefined ? { status: 'empty' } : { status: 'failed', message: failureMessage }
}

export { importComponentOrSetByKeyAsync }
