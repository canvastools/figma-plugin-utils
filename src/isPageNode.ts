/**
 * Narrows a node to a `PageNode`.
 *
 * A type predicate rather than a plain comparison: after the check TypeScript
 * knows about `selection`, `loadAsync` and the page level plugin data, so the
 * branch needs no cast.
 *
 * Mostly used to end an ancestor walk, which is exactly what `getPageOfNode`
 * already does — prefer that over walking `parent` by hand.
 */
const isPageNode = (node: BaseNode): node is PageNode => {
  return node.type === 'PAGE'
}

export { isPageNode }
