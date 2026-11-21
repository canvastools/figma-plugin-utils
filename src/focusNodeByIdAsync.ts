import { asSceneNode } from './asSceneNode'
import { focusNodesAsync } from './focusNodesAsync'
import type { TFocusNodesOptions } from './focusNodesAsync'

/**
 * Goes to the node of an id, on its page. See `focusNodesAsync` for what "goes to" means.
 *
 * The id is enough: `getNodeByIdAsync` finds a node on a page that is not loaded. So the caller does not give or walk a page.
 * An id of no node, of a page or of the document gives `false`.
 *
 * @example
 * await focusNodeByIdAsync(widgetId, { select: true })
 */
const focusNodeByIdAsync = async (id: string, options: TFocusNodesOptions = {}): Promise<boolean> => {
  try {
    const node = asSceneNode(await figma.getNodeByIdAsync(id))

    return node ? await focusNodesAsync([node], options) : false
  } catch (error) {
    console.log('Error in focusNodeByIdAsync() :', error)

    return false
  }
}

export { focusNodeByIdAsync }
