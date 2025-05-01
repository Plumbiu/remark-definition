import type { Plugin } from 'unified'
import type { Link, Text, Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { isString } from './utils'

export type DefinitionValue =
  | string
  | {
      label?: string
      url: string
    }

export interface RemarkDefinitionPluginOptions {
  /**
   * render Link node
   * @default true
   */
  renderLink?: boolean
}

function h(value: DefinitionValue): Text | Link {
  if (isString(value)) {
    return {
      type: 'text',
      value,
    }
  }

  return {
    type: 'link',
    url: value.url,
    children: [
      {
        type: 'text',
        value: value.label!,
      },
    ],
  }
}

const remarkDefinition: Plugin<
  [Record<string, DefinitionValue>, options?: RemarkDefinitionPluginOptions],
  Root
> = (
  map,
  options = {
    renderLink: true,
  },
) => {
  const { renderLink = true } = options

  return (tree) => {
    const regx = new RegExp(`\\[([^\\]]+)\\]\\[\\]`, 'g')
    visit(tree, 'text', (node, index, parent) => {
      if (index == null || parent == null || parent.type === 'link') {
        return
      }
      const value = node.value
      const children: (Text | Link)[] = []
      let m: RegExpExecArray | null = null
      let lastIndex = 0
      while ((m = regx.exec(value))) {
        const [match] = m
        if (match) {
          const text = match.slice(1, -3)
          const data: DefinitionValue = map[text]
          if (data) {
            children.push(h(node.value.slice(lastIndex, m.index)))
            if (isString(data)) {
              children.push(h({ url: data, label: text }))
            } else {
              children.push(h({ url: data.url, label: data.label ?? text }))
            }
            lastIndex = m.index + match.length
          }
        }
      }
      lastIndex !== 0 && children.push(h(node.value.slice(lastIndex)))
      if (children.length) {
        parent.children.splice(index, 1, ...children)
      }
    })
    if (renderLink) {
      visit(tree, 'link', (node) => {
        if (node.url) {
          return
        }
        const data = map[toString(node)]
        if (data) {
          if (isString(data)) {
            node.url = data
          } else {
            node.url = data.url
            if (data.label) {
              const firstChild = node.children[0]
              if (
                firstChild.type === 'text' ||
                firstChild.type === 'inlineCode'
              ) {
                firstChild.value = data.label
              }
            }
          }
        }
      })
    }
  }
}

export default remarkDefinition
