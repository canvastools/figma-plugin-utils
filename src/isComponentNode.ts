/**
 * Narrows a node to a `ComponentNode`.
 *
 * It is a type predicate, not a plain comparison. After the check, TypeScript knows `key`, `remote` and the component property definitions.
 * So the branch needs no cast.
 *
 * It matches a main component only. An instance of it is an `InstanceNode`. A variant in a set is a `ComponentNode` too.
 *
 * - Use `isComponentSetVariant` to tell a variant from a separate component.
 */
const isComponentNode = (node: BaseNode): node is ComponentNode => {
  return node.type === 'COMPONENT'
}

export { isComponentNode }
