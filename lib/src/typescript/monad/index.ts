/*
 * Private common functions for monads
 *
 * @see The `monet` library by Chris Myers and Jakub Strojewski of which this monad implementation is heavily inspired
 */

export const areEqual = (a: any, b: any): boolean => {
  if (a === b || a !== a && b !== b) {
    return true  
  }
  if (!a || !b) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    return false
  }
  /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call */
  if (isFunction(a.equals) && isFunction(b.equals)) {
    return a.equals(b)
  }
  /* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call */
  return false
}

export const equals = (a: any): (b: any) => boolean =>
  (b: any): boolean => areEqual(a, b)

export const falseFunction = (): boolean =>
  false

export const getArgs = (args: IArguments): Array<any> =>
  Array.prototype.slice.call(args)

export const idFunction = (value: any): any =>
  value

export const isFunction = (f: any): boolean =>
  Boolean(f && f.constructor && f.call && f.apply) // eslint-disable-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-member-access

export const noop = (): void => { } // eslint-disable-line @typescript-eslint/no-empty-function

export const swap = (f: any): any =>
  (a: any, b: any) =>
    f(b, a) // eslint-disable-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
