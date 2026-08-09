/**
 * Narrows a node to an `InstanceNode`.
 *
 * A type predicate rather than a plain comparison: after the check TypeScript
 * knows about `getMainComponentAsync`, `componentProperties`, `isExposedInstance`
 * and the rest, so the branch needs no cast.
 *
 * Being an instance is also what makes a node read only in practice — see
 * `hasInstanceParent` for the same question asked about a node's ancestors.
 */
const isInstanceNode = (node: BaseNode): node is InstanceNode => {
  return node.type === 'INSTANCE'
}

export { isInstanceNode }
