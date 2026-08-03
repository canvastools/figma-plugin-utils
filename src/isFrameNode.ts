const isFrameNode = (node: BaseNode): node is FrameNode => {
  return node.type === 'FRAME'
}

export { isFrameNode }
