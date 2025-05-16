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
            label: 'Next.js',
          },
          remark: {
            url: 'https://github.com/remarkjs/remark',
          },
          rehype: {
            url: 'https://github.com/rehypejs/rehype',
          },
          wiki: {
            url: 'https://zh.wikipedia.org/wiki/',
            label(data) {
              if (!data.pathname) {
                return '维基百科'
              }
              return '维基百科 - ' + data.pathname
            },
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
    assert.equal(transformed.toString(), output)
  })

  test('options: renderLink === false', async () => {
    const processor = buildProcessor({
      renderLink: false,
    })
    const transformed = await processor.process(
      `should transform: [next.js][]
should not transform link node: [next.js]()`,
    )
    assert.equal(
      transformed.toString().trim(),
      `should transform: [Next.js](https://github.com/vercel/next.js)
should not transform link node: [next.js]()`,
    )
  })

  test('pathname', async () => {
    const processor = buildProcessor({
      renderLink: false,
    })
    const transformed = await processor.process(
      `[wiki][]
[wiki][副作用_(计算机科学)]`,
    )
    assert.equal(
      transformed.toString().trim(),
      `[维基百科](https://zh.wikipedia.org/wiki)
[维基百科 - 副作用\\_(计算机科学)](https://zh.wikipedia.org/wiki/副作用_\\(计算机科学\\))`,
    )
  })
}

run()
