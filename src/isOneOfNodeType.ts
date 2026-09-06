/**
 * Whether a node is one of the listed types.
 *
 * The readable way to write the filters a plugin is full of — "frames and
 * components and instances" — without a chain of comparisons or a `Set` built at
 * every call site.
 *
 * It answers with a plain boolean and does not narrow the node: TypeScript would
 * have to be told the exact tuple of types for that, which is more ceremony than
 * a filter usually wants. Reach for `isFrameNode` and its siblings when the
 * branch after the check needs the node's own properties.
 *
 * @example
 * const containers = nodes.filter((node) => isOneOfNodeType(node, ['FRAME', 'COMPONENT', 'INSTANCE']))
 */
const isOneOfNodeType = (node: BaseNode, typeList: NodeType[]): boolean => {
  return typeList.includes(node.type)
}

export { isOneOfNodeType }
