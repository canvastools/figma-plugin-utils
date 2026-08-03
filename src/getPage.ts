const getPage = (node: BaseNode): PageNode => {
  if (node.type !== 'PAGE') {
    return getPage(node.parent as BaseNode)
  } else {
    return node as PageNode
  }
}

export { getPage }
