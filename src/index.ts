import type { Plugin } from 'unified'
import type { Link, Text, Root, PhrasingContent } from 'mdast'
import { visit } from 'unist-util-visit'
import { isString } from './utils'

export type TextLinkValueType =
  | string
  | ({
      text?: string
      children?: PhrasingContent[]
    } & Omit<Link, 'type' | 'position' | 'children'>)

const remarkTextLink: Plugin<[Record<string, TextLinkValueType>], Root> = (
  map,
) => {
  const keys = Object.keys(map)
  const regx = new RegExp(keys.join('|'), 'g')
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (index == null || parent == null || parent.type === 'link') {
        return
      }
      const value = node.value
      const valueData: (string | TextLinkValueType)[] = []
      let m: RegExpExecArray | null = null
      let lastIndex = 0
      while ((m = regx.exec(value))) {
        const [match] = m
        if (match) {
          const data: TextLinkValueType = map[match]
          if (data) {
            if (value[m.index - 1] === '\\') {
              node.value =
                node.value.slice(0, m.index - 1) + node.value.slice(m.index)
            } else {
              valueData.push(node.value.slice(lastIndex, m.index))
              if (isString(data)) {
                valueData.push({ url: data, text: match })
              } else {
                valueData.push({ ...data, text: data.text ?? match })
              }
              lastIndex = m.index + match.length
            }
          }
        }
      }
      lastIndex !== 0 && valueData.push(node.value.slice(lastIndex))
      if (valueData.length) {
        const children: (Text | Link)[] = valueData.map((item) => {
          if (isString(item)) {
            return {
              type: 'text',
              value: item,
            }
          }
          return {
            ...item,
            type: 'link',
            children: item.children ?? [
              {
                type: 'text',
                value: item.text!,
              },
            ],
          }
        })
        parent.children.splice(index, 1, ...children)
      }
    })
  }
}

export default remarkTextLink
