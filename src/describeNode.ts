import { isNodeAlive } from './isNodeAlive'

/**
 * Id and name of a node, for a log line or a report entry.
 *
 * Describing a node must never cause another failure: by the time something is
 * being reported, the node in question is often exactly the one that went bad,
 * so both reads are guarded. A node that cannot be read is described with empty
 * strings rather than skipped, so the caller still has an entry to report.
 *
 * @example
 * const { id, name } = describeNode(node)
 *
 * errors.push({ nodeId: id, nodeName: name, reason: 'MAIN_COMPONENT_MISSING' })
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
