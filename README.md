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
import remarkTextLink from 'remark-text-link'

const file = await unified()
  .use(remarkParse)
  .use(remarkTextLink, {
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

> [!NOTE]
> Add backward slash like `\next.js` will not be transformed.

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

## Markdown example

See the innput file [input.md](/test/input.md) and the output file [output.md](/test/output.md).


## Test

run `pnpm test`

<!-- Definitions -->

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
