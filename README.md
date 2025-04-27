# remark-text-link

[简体中文](/README-zh.md) | [English](/README.md)

This package is [unified][] ([remark][]) plugin to convert text to link by global config.

## Install

```sh
npm install remark-text-link
```

## Usage

see [example.ts](/example.ts)

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkTexLink from 'remark-text-link'

const file = await unified()
  .use(remarkParse)
  .use(remarkTexLink, {
    // your config here
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      text: 'Next.js',
    },
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('next.js')
console.log(String(file))
// output:
// <p><a href="https://github.com/vercel/next.js">Next.js</a></p>
```

## Option

The options type `TextLinkValueType` definitions:

```js
import type { Link, PhrasingContent } from 'mdast'

type TextLinkValueType =
  | string
  | ({
      text?: string
      children?: PhrasingContent[]
    } & Omit<Link, 'type' | 'position' | 'children'>)
```

# Markdown example

See [input.md](/test/input.md) file:

```markdown
Text, Italic, strong will be transformed: next.js, _next.js_ **next.js**, ~~next.js~~, ~next.js~.

Inline code, link and strikethrough will not be transformed: [next.js](https://github.com/vercel/next.js), `next.js`.
```

The output file [output.md](/test/output.md):

```markdown
Text, Italic, strong will be transformed: [Next.js](https://github.com/vercel/next.js), _[Next.js](https://github.com/vercel/next.js)_ **[Next.js](https://github.com/vercel/next.js)**, ~~[Next.js](https://github.com/vercel/next.js)~~, ~[Next.js](https://github.com/vercel/next.js)~.

Inline code, link and strikethrough will not be transformed: [next.js](https://github.com/vercel/next.js), `next.js`.
```

<!-- Definitions -->

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
