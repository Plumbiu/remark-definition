import type { Plugin } from 'unified'
import type { Link, Text, Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { isString, joinUrl } from './utils'

export type DefinitionObjectValue = {
  label?:
    | string
    | ((
        value: DefinitionObjectValue & {
          pathname: string
        },
      ) => string)
  url: string
}

export type DefinitionValue = string | DefinitionObjectValue

export interface RemarkDefinitionPluginOptions {
  /**
   * render Link node
   * @default true
   */
  renderLink?: boolean
  /**
   * ingnore case, use lower case for map key
   * @default true
   */
  caseInsensitive?: boolean
}

function renderLinkValue(value: DefinitionObjectValue, pathname = '') {
  if (isString(value.label)) {
    return value.label
  }
  return value.label!({ ...value, pathname })
}

function h(value: DefinitionValue, pathname = ''): Text | Link {
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
        value: renderLinkValue(value, pathname),
      },
    ],
  }
}
const regx = /\[([^\]]+)\]\[([^\]]*)\]/g

const remarkDefinition: Plugin<
  [Record<string, DefinitionValue>, options?: RemarkDefinitionPluginOptions],
  Root
> = (
  map,
  options = {
    renderLink: true,
  },
) => {
  const { renderLink = true, caseInsensitive = true } = options

  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (index == null || parent == null || parent.type === 'link') {
        return
      }
      const value = node.value
      const children: (Text | Link)[] = []
      let m: RegExpExecArray | null = null
      let lastIndex = 0
      while ((m = regx.exec(value))) {
        const [raw, text, pathname] = m
        if (raw) {
          let data: DefinitionValue = map[text]
          if (!data && !caseInsensitive) {
            data = map[text.toLowerCase()]
          }
          if (data) {
            children.push(h(node.value.slice(lastIndex, m.index)))
            if (isString(data)) {
              children.push(
                h({ url: joinUrl(data, pathname), label: text }, pathname),
              )
            } else {
              children.push(
                h(
                  {
                    url: joinUrl(data.url, pathname),
                    label: data.label ?? text,
                  },
                  pathname,
                ),
              )
            }
            lastIndex = m.index + raw.length
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
                firstChild.value = renderLinkValue(data)
              }
            }
          }
        }
      })
    }
  }
}

export default remarkDefinition
