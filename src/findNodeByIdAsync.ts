/**
 * The node of an id when it has one of the given types, or `null`.
 *
 * **A node is not enough.** An old stored id can resolve to a node that changed its type.
 * A component that a designer detached into a frame keeps its id.
 * For the caller, such an id names nothing, as an id of a deleted node.
 * An id that is not a node throws in Figma, and the answer is the same: nothing.
 *
 * The result has the narrowed type of the given types.
 *
 * @example
 * const master = await findNodeByIdAsync(id, ['COMPONENT', 'COMPONENT_SET'])
 * // → ComponentNode | ComponentSetNode | null
 */
const findNodeByIdAsync = async <TType extends NodeType>(
  id: string,
  types: readonly TType[],
): Promise<Extract<BaseNode, { type: TType }> | null> => {
  try {
    const node = await figma.getNodeByIdAsync(id)

    return node && (types as readonly NodeType[]).includes(node.type) ? (node as Extract<BaseNode, { type: TType }>) : null
  } catch (error) {
    console.log('Error in findNodeByIdAsync() :', error)

    return null
  }
}

export { findNodeByIdAsync }
