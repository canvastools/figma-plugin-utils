/**
 * Narrows a node to an `InstanceNode`.
 *
 * It is a type predicate, not a plain comparison.
 * After the check, TypeScript knows `getMainComponentAsync`, `componentProperties`, `isExposedInstance` and the other members.
 * So the branch needs no cast.
 *
 * An instance is read only in practice. `hasInstanceAncestor` asks the same question about the ancestors of a node.
 */
const isInstanceNode = (node: BaseNode): node is InstanceNode => {
  return node.type === 'INSTANCE'
}

export { isInstanceNode }
