/**
 * Narrows a node to a `PageNode`.
 *
 * It is a type predicate, not a plain comparison. After the check, TypeScript knows `selection`, `loadAsync` and the plugin data of the page.
 * So the branch needs no cast.
 *
 * - Use `getPageOfNode` to end a walk of the ancestors. Do not walk `parent` by hand.
 */
const isPageNode = (node: BaseNode): node is PageNode => {
  return node.type === 'PAGE'
}

export { isPageNode }
