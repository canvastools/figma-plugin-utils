const isComponentNode = (node: BaseNode): boolean => {
  return node.type === 'COMPONENT'
}

export { isComponentNode }
