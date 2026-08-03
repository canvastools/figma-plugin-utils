const isComponentNode = (node: BaseNode): node is ComponentNode => {
  return node.type === 'COMPONENT'
}

export { isComponentNode }
