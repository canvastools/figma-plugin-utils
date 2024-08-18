const isComponenSetNode = (node: BaseNode): boolean => {
  return node.type === 'COMPONENT_SET'
}

export { isComponenSetNode }
