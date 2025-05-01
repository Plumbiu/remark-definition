# remark-definition

[简体中文](/README-zh.md) | [English](/README.md)

这个依赖是 [unified][] ([remark][]) 插件，通过全局配置将文字转换为链接.

## 安装

```sh
npm install remark-definition
```

## 使用

可以尝试运行 [example.ts](/example.ts)

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkDefinition from 'remark-definition'

const file = await unified()
  .use(remarkParse)
  .use(remarkDefinition, {
    // 你的配置
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      text: 'Next.js',
    },
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('[next.js][]') // 或者 `[next.js]()`
console.log(String(file))
// 输出：
// <p><a href="https://github.com/vercel/next.js">Next.js</a></p>
```

# 跳过空链接

`remark-definition` 默认会转换空链接，例如 `[next.js]()`，设置 `renderLink` 为 false 去跳过链接节点.

```js
await unified()
  .use(remarkParse)
  .use(remarkDefinition, {
    // your config here
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      text: 'Next.js',
    },
    { renderLink: false } // 配置项
  })
```

## Option

参数配置类型为 `[DefinitionValue, RemarkDefinitionPluginOptions]`，它的定义如下:

```js
import type { Link, PhrasingContent } from 'mdast'

type DefinitionValue =
  | string
  | ({
      text?: string
      children?: PhrasingContent[]
    } & Omit<Link, 'type' | 'position' | 'children'>)
interface RemarkDefinitionPluginOptions {
  /**
   * render Text node
   * @default true
   */
  renderText?: boolean
  /**
   * render Link node
   * @default true
   */
  renderLink?: boolean
}
```

# Markdown 例子

查看输入 [input.md](/test/input.md) 文件和输出文件 [output.md](/test/output.md):

## 测试

运行命令 `pnpm test`

<!-- Definitions -->

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
