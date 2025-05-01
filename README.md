# remark-definition

[简体中文](/README-zh.md) | [English](/README.md)

This package is [unified][] ([remark][]) plugin to convert text to link by global config.

## Install

```sh
npm install remark-definition
```

## Usage

see [example.ts](/example.ts)

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkDefinition from 'remark-definition'

const file = await unified()
  .use(remarkParse)
  .use(remarkDefinition, {
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

# Skip text

You might not want the text to be converted, you can use a safer options `renderText = false`.

```js
await unified()
  .use(remarkParse)
  .use(remarkDefinition, {
    // your config here
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      text: 'Next.js',
    },
    { renderText: false } // options
  })
```

## Option

The options type `[DefinitionValue, RemarkDefinitionPluginOptions]` definitions:

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

## Markdown example

See the innput file [input.md](/test/input.md) and the output file [output.md](/test/output.md).

## Test

run `pnpm test`

<!-- Definitions -->

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
