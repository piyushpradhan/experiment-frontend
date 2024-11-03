// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: NodeJS.Timeout | undefined
  let lastRan: number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (!lastRan) {
      // @ts-expect-error this is of type any
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          // @ts-expect-error this is of type any
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
