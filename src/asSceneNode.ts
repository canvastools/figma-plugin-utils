/**
 * Narrows a node from the API to a `SceneNode`, or gives `null`.
 *
 * `getNodeByIdAsync` gives a `BaseNode`, and the document and its pages are nodes too.
 * A plugin with an id does not mean them. They have no geometry, no parent chain and no visibility, and the code after the lookup reads these.
 *
 * The cast is correct: each other `BaseNode` in a Figma document is a scene node. After the helper excludes the two types, nothing is left to check.
 * The helper keeps this assertion in one place, not at each call site.
 *
 * It also gives `null` for a node whose type it cannot read. A deleted node gets the same answer.
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
