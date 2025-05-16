export const isString = (x: unknown): x is string => {
  return typeof x === 'string'
}

export const isNumber = (x: unknown): x is number => {
  return typeof x === 'number'
}

export function joinUrl(...args: (string | number)[]): string {
  let url = String(args[0])
  while (url[url.length - 1] === '/') {
    url = url.slice(0, -1)
  }
  for (let i = 1; i < args.length; i++) {
    let arg = args[i]
    if (isNumber(arg)) {
      arg = String(arg)
    }
    if (isString(arg)) {
      while (arg[0] === '/') {
        arg = arg.slice(1)
      }
      url += '/' + arg
    }
  }
  while (url[url.length - 1] === '/') {
    url = url.slice(0, -1)
  }
  return url
}
