/**
 * The node an id names, if it is one of the given types — or `null`.
 *
 * **A node is not enough.** An id stored a while ago can resolve to something
 * that is no longer what it was stored as — a component detached into a frame
 * keeps its id — and such an id names nothing the caller can use, exactly as one
 * whose node was deleted. An id that is not a node at all throws inside Figma,
 * and that is the same answer: nothing.
 *
 * The answer is narrowed to the types asked for.
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
