/**
 * Narrows a node to a `ComponentSetNode` — the container holding the variants of
 * one component.
 *
 * A type predicate rather than a plain comparison: after the check TypeScript
 * knows about `key`, `remote` and the variant group properties, so the branch
 * needs no cast.
 *
 * A set is never what an instance points at directly: `getMainComponentAsync`
 * answers with the variant, and `getComponentSetOfVariant` climbs from there.
 */
const isComponentSetNode = (node: BaseNode): node is ComponentSetNode => {
  return node.type === 'COMPONENT_SET'
}

export { isComponentSetNode }
