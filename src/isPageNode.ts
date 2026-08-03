const isPageNode = (node: BaseNode): node is PageNode => {
  return node.type === 'PAGE'
}

export { isPageNode }
