based on [remark][] and [rehype][].

Text, Italic, strong will be transformed: [next.js][/issues], _[next.js][]_, **[next.js][]**, ~~[next.js][]~~, ~[next.js][]~.

Inline code, link and strikethrough will not be transformed: [next.js](https://github.com/vercel/next.js), `next.js`.

Empty link [next.js]() should work.
