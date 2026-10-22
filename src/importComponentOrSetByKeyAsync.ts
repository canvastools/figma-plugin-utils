/* What one import produced. `empty` is "no such thing", `failed` is "could not ask" */
export type TImportByKeyOutcome =
  { status: 'found'; node: ComponentNode | ComponentSetNode } | { status: 'empty' } | { status: 'failed'; message: string }

/**
 * Imports a published component or component set by its key, whichever of the
 * two it is.
 *
 * Figma has one import call per node type and no way to ask which one a key
 * belongs to, so both are tried — `preferType` only decides which goes first.
 * Adding variants to a component replaces it with a set holding it, and a key
 * written on either side of that edit still means the same component;
 * committing to one call would report that everyday case as an unreachable
 * library. The second call costs nothing when the first one answers, which is
 * the usual outcome.
 *
 * Figma rejects an import both for "no published component with that key" and
 * for "the request failed", and does not say which — so a rejection is only
 * evidence that this key did not work right now, never that the component is
 * gone. Telling the two apart is the caller's business, which is why `empty`
 * and `failed` are separate outcomes rather than one `null`. `failed` carries
 * the first rejection: the fallback fails for its own reasons.
 *
 * A local component that was never published has a key and cannot be imported
 * by it — look in the document first.
 *
 * `onApiCall` is called right before every attempt, for a caller counting or
 * capping the most expensive call a plugin makes.
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
