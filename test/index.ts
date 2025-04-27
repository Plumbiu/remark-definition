import test from 'node:test'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import remarkTextLink from '../src'

async function run() {
  const processer = unified()
    .use(remarkParse)
    .use(remarkTextLink, {
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
    })
    .use(remarkStringify, {
      emphasis: '_',
    })
  const input = await readFile('./test/input.md', 'utf-8')
  const output = await readFile('./test/output.md', 'utf-8')
  test('remark-text-link', async () => {
    const transformed = await processer.process(input)
    assert.equal(output, transformed.toString())
  })

  test('backward slash', async () => {
    const transformed = await processer.process(
      'backword slash should not be transformed: Next,js',
    )
    assert.equal(
      'backword slash should not be transformed: Next,js',
      transformed.toString().trim(),
    )
  })
}

run()
