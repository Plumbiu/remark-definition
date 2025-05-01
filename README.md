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
  .process('[next.js][]') // or '[next.js]()'
console.log(String(file))
// output:
// <p><a href="https://github.com/vercel/next.js">Next.js</a></p>
```

# Skip empty link

`remark-definition` converts empty links by default, e.g. `[next.js]()`, and sets 'renderLink' to false to skip empty link nodes.

```js
await unified()
  .use(remarkParse)
  .use(remarkDefinition, {
    // your config here
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      text: 'Next.js',
    },
    { renderLink: false } // options
  })
```

## Option

The options type `[DefinitionValue, RemarkDefinitionPluginOptions]` definitions:

```js
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
```

## Markdown example

See the innput file [input.md](/test/input.md) and the output file [output.md](/test/output.md).

## Test

run `pnpm test`

<!-- Definitions -->

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
