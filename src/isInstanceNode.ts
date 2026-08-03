const isInstanceNode = (node: BaseNode): node is InstanceNode => {
  return node.type === 'INSTANCE'
}

export { isInstanceNode }
