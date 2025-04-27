# remark-text-link

[简体中文](/README-zh.md) | [English](/README.md)

这个依赖是 [unified][] ([remark][]) 插件，通过全局配置将文字转换为链接.

## 安装

```sh
npm install remark-text-link
```

## 使用

可以尝试运行 [example.ts](/example.ts)

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkTexLink from 'remark-text-link'

const file = await unified()
  .use(remarkParse)
  .use(remarkTexLink, {
    // 你的配置
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      text: 'Next.js',
    },
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('next.js')
console.log(String(file))
// 输出：
// <p><a href="https://github.com/vercel/next.js">Next.js</a></p>
```

## Option

参数配置类型为 `TextLinkValueType`，它的定义如下:

```js
import type { Link, PhrasingContent } from 'mdast'

type TextLinkValueType =
  | string
  | ({
      text?: string
      children?: PhrasingContent[]
    } & Omit<Link, 'type' | 'position' | 'children'>)
```

# Markdown 例子

见 [input.md](/test/input.md) 文件:

```markdown
Text, Italic, strong will be transformed: next.js, _next.js_ **next.js**, ~~next.js~~, ~next.js~.

Inline code, link and strikethrough will not be transformed: [next.js](https://github.com/vercel/next.js), `next.js`.
```

输出的文件 [output.md](/test/output.md):

```markdown
Text, Italic, strong will be transformed: [Next.js](https://github.com/vercel/next.js), _[Next.js](https://github.com/vercel/next.js)_ **[Next.js](https://github.com/vercel/next.js)**, ~~[Next.js](https://github.com/vercel/next.js)~~, ~[Next.js](https://github.com/vercel/next.js)~.

Inline code, link and strikethrough will not be transformed: [next.js](https://github.com/vercel/next.js), `next.js`.
```

<!-- Definitions -->

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
