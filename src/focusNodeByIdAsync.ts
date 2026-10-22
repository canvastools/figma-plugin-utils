import { asSceneNode } from './asSceneNode'
import { focusNodesAsync } from './focusNodesAsync'

/**
 * Goes to the node an id names, on whatever page it stands — see
 * `focusNodesAsync` for what going there means.
 *
 * The id is enough: `getNodeByIdAsync` finds a node on a page that is not
 * loaded, so there is no page to pass and no page to walk. An id naming nothing,
 * or naming a page or the document, answers `false`.
 *
 * @example
 * await focusNodeByIdAsync(widgetId, { select: true })
 */
const focusNodeByIdAsync = async (id: string, options: { select?: boolean } = {}): Promise<boolean> => {
  try {
    const node = asSceneNode(await figma.getNodeByIdAsync(id))

    return node ? await focusNodesAsync([node], options) : false
  } catch (error) {
    console.log('Error in focusNodeByIdAsync() :', error)

    return false
  }
}

export { focusNodeByIdAsync }
