/*
MIT License

Copyright (c) 2022 Cyril Dever

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { List, Nil } from '..'

export interface Maybe<T> {
  /* Monad implementation */
  ap<V>(maybeFn: Maybe<(val: T) => V>): Maybe<V>
  bind<V>(fn: (val: T) => Maybe<V>): Maybe<V>
  flatMap<V>(fn: (val: T) => Maybe<V>): Maybe<V>
  chain<V>(fn: (val: T) => Maybe<V>): Maybe<V>
  join<V>(): Maybe<V> // If T extends Maybe<V>
  map<V>(fn: (val: T) => V): Maybe<V>
  takeLeft(m: Maybe<T>): Maybe<T>
  takeRight(m: Maybe<T>): Maybe<T>

  /* Maybe specifics */
  cata<Z>(none: () => Z, some: (val: T) => Z): Z
  filter<U extends T>(fn: (val: T) => val is U): Maybe<U>
  filter(fn: (val: T) => boolean): Maybe<T>
  fold<V>(val: V): (fn: (val: T) => V) => V
  forEach(fn: (val: T) => void): void

  getOrElse(val: T): T
  isNone(): boolean
  isSome(): boolean
  some(): T
  toList(): List<T>
}

class MaybeImpl<T> implements Maybe<T> {
  private hasValue: boolean
  private val: T

  constructor(isValue: boolean, val: T) {
    this.hasValue = isValue
    if (isValue && isNothing(val)) {
      throw new Error('Can not create Some with illegal value: ' + val + '.') // eslint-disable-line @typescript-eslint/restrict-plus-operands
    }
    this.val = val
  }

  /* Monad implementation */

  ap<V>(maybeFn: Maybe<(val: T) => V>): Maybe<V> {
    if (this.hasValue) {
      const value = this.val
      return maybeFn.map(function (fn) {
        return fn(value)
      })
    } else {
      return None<V>()
    }
  }

  bind<V>(bindFn: (val: T) => Maybe<V>): Maybe<V> {
    return this.hasValue ? bindFn(this.val) : None<V>()
  }

  flatMap<V>(flatMapFn: (val: T) => Maybe<V>): Maybe<V> {
    return this.hasValue ? flatMapFn(this.val) : None<V>()
  }

  chain<V>(chainFn: (val: T) => Maybe<V>): Maybe<V> {
    return this.hasValue ? chainFn(this.val) : None<V>()
  }

  join<V>(): Maybe<V> {
    return this.flatMap(idFunction)
  }

  map<V>(mapFn: (val: T) => V): Maybe<V> {
    try {
      const m = mapFn(this.val)
      return m !== undefined ? Some(m) : None<V>()
    } catch (e) {
      return None<V>()
    }
  }

  takeLeft(m: Maybe<T>): Maybe<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return apply2(this, m, function (a: Maybe<T>, b: Maybe<T>): Maybe<T> {
      return a
    })
  }

  takeRight(m: Maybe<T>): Maybe<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return apply2(this, m, function (a: Maybe<T>, b: Maybe<T>): Maybe<T> {
      return b
    })
  }

  /* Maybe specifics */

  cata<Z>(none: () => Z, some: (val: T) => Z): Z {
    return this.isSome() ? some(this.val) : none()
  }

  filter(fn: (val: T) => boolean): Maybe<T> {
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias
    return self.flatMap(function (a: T): Maybe<T> {
      return a !== null && fn(a) ? Some(self.val) : None<T>()
    })
  }

  fold<V>(defaultValue: V): (fn: (val: T) => V) => V {
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias
    return function (fn) {
      return self.isSome() ? fn(self.val) : defaultValue
    }
  }

  forEach(fn: (val: T) => void): void {
    return this.cata(noop, fn)
  }

  getOrElse(val: T): T {
    return this.hasValue ? this.val : val
  }

  isNone(): boolean {
    return !this.isSome()
  }

  isSome(): boolean {
    return this.hasValue
  }

  some(): T {
    if (this.hasValue) {
      return this.val
    } else {
      throw new Error('Cannot call .some() on a None.')
    }
  }

  toList(): List<T> {
    return this.hasValue ? List.of(this.val) : Nil<T>()
  }
}

const apply2 = <T>(a1: Maybe<T>, a2: Maybe<T>, f: (a: Maybe<T>, b: Maybe<T>) => Maybe<T>): Maybe<T> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  a2.ap(a1.map(curry(f, [])))

const curry = (fn: any, args: Array<any>) => {
  return function () {
    const args1 = args.concat(getArgs(arguments)) // eslint-disable-line prefer-rest-params
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return args1.length >= fn.length ?
      // eslint-disable-next-line prefer-spread, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      fn.apply(null, args1.slice(0, args1.length)) :
      curry(fn, args1)
  }
}

const getArgs = (args: IArguments): Array<any> =>
  Array.prototype.slice.call(args)

const idFunction = (value: any): any =>
  value

const isNothing = (val: any): boolean =>
  val === null || val === undefined

const noop = (): void => { } // eslint-disable-line @typescript-eslint/no-empty-function

export const Some = <T>(val: T): Maybe<T> =>
  new MaybeImpl(true, val)

export const None = <T>(): Maybe<T> =>
  new MaybeImpl(false, null as T)

const fromNull = <T>(val: T | null): Maybe<T> => {
  return isNothing(val) ? None<T>() : Some<T>(val as T)
}

const fromUndefined = <V>(val: V | undefined): Maybe<V> => {
  return val === undefined ? None<V>() : Some(val as V)
}

const toList = <T>(val: Maybe<T>): List<T> => {
  return val.toList()
}

export const Maybe = {
  fromNull,
  fromUndefined,
  None,
  Some,
  toList
}
