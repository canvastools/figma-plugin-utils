/**
 * Narrows a node to a `FrameNode`.
 *
 * A type predicate rather than a plain comparison: after the check TypeScript
 * knows about `children`, layout and the auto layout properties, so the branch
 * needs no cast.
 *
 * Matches a plain frame only. Components, sets and instances are frame like and
 * carry the very same layout properties, but each has its own node type — reach
 * for `isOneOfNodeType` when all of them should pass.
 */
const isFrameNode = (node: BaseNode): node is FrameNode => {
  return node.type === 'FRAME'
}

export { isFrameNode }
