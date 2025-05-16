import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkDefinition from './src/index'

const file = await unified()
  .use(remarkParse)
  .use(remarkDefinition, {
    'next.js': {
      url: 'https://github.com/vercel/next.js',
      label: 'Next.js',
    },
  })
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('[next.js][]')

console.log(String(file))
