const isOneOfNodeType = (node: BaseNode, typeList: NodeType[]): boolean => {
  return typeList.includes(node.type)
}

export { isOneOfNodeType }
