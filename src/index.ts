import type { Plugin } from 'unified'
import type { Link, Text, Root, PhrasingContent } from 'mdast'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { isString } from './utils'

export type DefinitionValue =
  | string
  | ({
      text?: string
      children?: PhrasingContent[]
    } & Omit<Link, 'type' | 'position' | 'children'>)

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
    ...value,
    type: 'link',
    children: value.children ?? [
      {
        type: 'text',
        value: value.text!,
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
    const keys = Object.keys(map)
    const regx = new RegExp(
      keys.map((key) => `\\[${key}\\]\\[\\]`).join('|'),
      'g',
    )
    visit(tree, 'text', (node, index, parent) => {
      if (index == null || parent == null || parent.type === 'link') {
        return
      }
      const value = node.value
      const valueData: (string | DefinitionValue)[] = []
      let m: RegExpExecArray | null = null
      let lastIndex = 0
      while ((m = regx.exec(value))) {
        const [match] = m
        if (match) {
          const text = match.slice(1, -3)
          const data: DefinitionValue = map[text]
          if (data) {
            valueData.push(node.value.slice(lastIndex, m.index))
            if (isString(data)) {
              valueData.push({ url: data, text: text })
            } else {
              valueData.push({ ...data, text: data.text ?? text })
            }
            lastIndex = m.index + match.length
          }
        }
      }
      lastIndex !== 0 && valueData.push(node.value.slice(lastIndex))
      if (valueData.length) {
        const children = valueData.map(h)
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
            if (data.children) {
              node.children = data.children
            } else if (data.text) {
              const firstChild = node.children[0]
              if (
                firstChild.type === 'text' ||
                firstChild.type === 'inlineCode'
              ) {
                firstChild.value = data.text
              }
            }
          }
        }
      })
    }
  }
}

export default remarkDefinition
