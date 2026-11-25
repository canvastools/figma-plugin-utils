/**
 * Narrows a node to a `ComponentSetNode`: the container of the variants of one component.
 *
 * It is a type predicate, not a plain comparison. After the check, TypeScript knows `key`, `remote` and the variant group
 * properties.
 * So the branch needs no cast.
 *
 * An instance does not point at a set directly. `getMainComponentAsync` gives the variant, and `getComponentSetOfVariant` goes
 * up from there.
 */
const isComponentSetNode = (node: BaseNode): node is ComponentSetNode => {
  return node.type === 'COMPONENT_SET'
}

export { isComponentSetNode }
