const isInstanceNode = (node: BaseNode): boolean => {
  return node.type === 'INSTANCE'
}

export { isInstanceNode }
