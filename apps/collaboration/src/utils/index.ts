export const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout | undefined
  let lastRan: number

  return function (...args: any[]) {
    // @ts-ignore
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
