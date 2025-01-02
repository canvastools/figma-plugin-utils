import { isPageNode } from './isPageNode'

const getPage = (node: BaseNode): PageNode => {
	if (!isPageNode(node)) {
		return getPage(node.parent as BaseNode)
	} else {
		return node as PageNode
	}
}

export { getPage }
