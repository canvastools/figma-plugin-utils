/**
 * Narrows a node to a `FrameNode`.
 *
 * It is a type predicate, not a plain comparison. After the check, TypeScript knows `children`, the layout and the auto layout properties.
 * So the branch needs no cast.
 *
 * It matches a plain frame only. Components, sets and instances have the same layout properties, but each has its own node type.
 *
 * - Use `isOneOfNodeType` when all of them must pass.
 */
const isFrameNode = (node: BaseNode): node is FrameNode => {
  return node.type === 'FRAME'
}

export { isFrameNode }
