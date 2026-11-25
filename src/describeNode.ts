import { isNodeAlive } from './isNodeAlive'

/**
 * The id and the name of a node, for a log line or a report entry.
 *
 * A description must not cause a second failure. The node in a report is often the node that failed, so both reads have a
 * guard.
 * A node that the helper cannot read gets empty strings and is not skipped. So the caller still has an entry to report.
 *
 * @example
 * const { id, name } = describeNode(node)
 *
 * errors.push({ nodeId: id, nodeName: name, reason: 'not found' })
 */
const describeNode = (node: BaseNode): { id: string; name: string } => {
  if (!isNodeAlive(node)) {
    return { id: '', name: '' }
  }

  try {
    return { id: node.id, name: node.name }
  } catch {
    return { id: '', name: '' }
  }
}

export { describeNode }
