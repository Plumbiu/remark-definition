import test from 'node:test'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import remarkDefinition, { RemarkDefinitionPluginOptions } from '../src'

async function run() {
  const buildProcessor = (options?: RemarkDefinitionPluginOptions) => {
    const processor = unified()
      .use(remarkParse)
      .use(
        remarkDefinition,
        {
          'next.js': {
            url: 'https://github.com/vercel/next.js',
            text: 'Next.js',
          },
          remark: {
            url: 'https://github.com/remarkjs/remark',
          },
          rehype: {
            url: 'https://github.com/rehypejs/rehype',
          },
        },
        options,
      )
      .use(remarkStringify, {
        emphasis: '_',
      })
    return processor
  }

  const input = await readFile('./test/input.md', 'utf-8')
  const output = await readFile('./test/output.md', 'utf-8')
  test('remark-definition', async () => {
    const processor = buildProcessor()
    const transformed = await processor.process(input)
    assert.equal(output, transformed.toString())
  })

  test('options: renderText === false', async () => {
    const processor = buildProcessor({
      renderText: false,
    })
    const transformed = await processor.process(
      `should not transform Text node: next.js
should transform link node: [next.js]()
should transform link node: [\`next.js\`]()`,
    )
    assert.equal(
      `should not transform Text node: next.js
should transform link node: [Next.js](https://github.com/vercel/next.js)
should transform link node: [\`Next.js\`](https://github.com/vercel/next.js)`,
      transformed.toString().trim(),
    )
  })

  test('options: renderLink === false', async () => {
    const processor = buildProcessor({
      renderLink: false,
    })
    const transformed = await processor.process(
      `should not transform Text node: next.js
should transform link node: [next.js]()
should transform link node: [\`next.js\`]()`,
    )
    assert.equal(
      `should not transform Text node: [Next.js](https://github.com/vercel/next.js)
should transform link node: [next.js]()
should transform link node: [\`next.js\`]()`,
      transformed.toString().trim(),
    )
  })
}

run()
