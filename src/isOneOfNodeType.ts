/**
 * Whether a node has one of the listed types.
 *
 * It is a readable form of the filters of a plugin, for example "frames, components and instances".
 * It needs no chain of comparisons and no `Set` at each call site.
 *
 * It gives a plain boolean and does not narrow the node. A narrowed type needs the exact tuple of types, and a filter usually does not need that work.
 *
 * - Use `isFrameNode` and the other type predicates when the branch after the check needs the properties of the node.
 *
 * @example
 * const containers = nodes.filter((node) => isOneOfNodeType(node, ['FRAME', 'COMPONENT', 'INSTANCE']))
 */
const isOneOfNodeType = (node: BaseNode, typeList: NodeType[]): boolean => {
  return typeList.includes(node.type)
}

export { isOneOfNodeType }
