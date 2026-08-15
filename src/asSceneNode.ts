/**
 * Narrows a node the API handed back to a `SceneNode`, or null.
 *
 * `getNodeByIdAsync` answers with a `BaseNode`, and the document and its pages
 * are nodes too — neither of them is anything a plugin holding an id actually
 * means, and neither has the geometry, the parent chain or the visibility that
 * the code after the lookup goes on to read.
 *
 * The cast is the honest part: every other `BaseNode` in a Figma document is a
 * scene node, so once those two types are ruled out there is nothing left to
 * check. Doing it here rather than at the call site is what keeps the assertion
 * in one place.
 *
 * Null is also the answer for a node whose type cannot be read, which is the
 * same answer a deleted node deserves.
 *
 * @example
 * const node = asSceneNode(await figma.getNodeByIdAsync(id))
 *
 * if (!node) return { status: 'empty' }
 */
const asSceneNode = (node: BaseNode | null | undefined): SceneNode | null => {
  if (!node) {
    return null
  }

  try {
    if (node.type === 'DOCUMENT' || node.type === 'PAGE') {
      return null
    }
  } catch (error) {
    console.log('Error in asSceneNode() :', error)

    return null
  }

  return node as SceneNode
}

export { asSceneNode }
