/**
 * Narrows a node to a `ComponentNode`.
 *
 * A type predicate rather than a plain comparison: after the check TypeScript
 * knows about `key`, `remote` and the component property definitions, so the
 * branch needs no cast.
 *
 * Matches a master only. An instance of it is an `InstanceNode`, and a variant
 * inside a set is a `ComponentNode` too — use `isComponentSetVariant` when the
 * two have to be told apart.
 */
const isComponentNode = (node: BaseNode): node is ComponentNode => {
  return node.type === 'COMPONENT'
}

export { isComponentNode }
