const curry = fn => {
  return function curriedFn(...args) {
    if (args.length < fn.length) {
      return function() {
        return curriedFn.apply(null, args.concat([].slice.call(arguments)))
      }
    }
    return fn.apply(null, args)
  }
}
