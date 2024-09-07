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

import { areEqual, falseFunction, getArgs, idFunction, noop } from '.'
import { Maybe, None, Some } from '..'

export interface Either<E, T> {
  /* Monad implementation */
  ap<V>(eitherFn: Either<E, (val: T) => V>): Either<E, V>
  bind<V>(fn: (val: T) => Either<E, V>): Either<E, V>
  flatMap<V>(fn: (val: T) => Either<E, V>): Either<E, V>
  chain<V>(fn: (val: T) => Either<E, V>): Either<E, V>
  join<V>(): Either<E, V> // If T is Either<V>
  map<V>(fn: (val: T) => V): Either<E, V>
  takeLeft(m: Either<E, T>): Either<E, T>
  takeRight(m: Either<E, T>): Either<E, T>

  /* Either specifics */
  cata<Z>(leftFn: (err: E) => Z, rightFn: (val: T) => Z): Z
  equals(other: Either<E, T>): boolean
  fold<Z>(leftFn: (err: E) => Z, rightFn: (val: T) => Z): Z
  leftMap<F>(fn: (leftVal: E) => F): Either<F, T>
  swap(): Either<T, E>

  isLeft(): boolean
  isRight(): boolean
  left(): E
  right(): T
  forEach(fn: (val: T) => void): void
  forEachLeft(fn: (val: E) => void): void

  toMaybe(): Maybe<T>
  toPromise(): Promise<T>
}

/**
 * Implement an `Either<Left, Right>` instance
 * 
 * @tparam `<E, T>` The type parameters with `E` as left and `T` as right types
 * @param {E | T} val The value
 * @param {boolean} isRightValue Set to `true` when the value is a right value of type `T`
 */
class EitherImpl<E, T> implements Either<E, T> {
  private isRightValue: boolean
  private value: E | T

  constructor(val: E | T, isRightValue: boolean) {
    this.isRightValue = isRightValue
    this.value = val
  }

  /* Monad implementation */

  ap<V>(eitherWithFn: Either<E, (val: T) => V>): Either<E, V> {
    if (this.isRightValue) {
      /* eslint-disable @typescript-eslint/no-this-alias */
      const self = this
      return eitherWithFn.map(function (fn) {
        return fn(self.value as T)
      })
      /* eslint-enable @typescript-eslint/no-this-alias */
    } else {
      return Either<E, V>(this.value as V, false)
    }
  }

  bind<V>(bindFn: (val: T) => Either<E, V>): Either<E, V> {
    return this.isRightValue ? bindFn(this.value as T) : Either(this.value as V, false)
  }

  flatMap<V>(flatMapFn: (val: T) => Either<E, V>): Either<E, V> {
    return this.isRightValue ? flatMapFn(this.value as T) : Either(this.value as V, false)
  }

  chain<V>(chainFn: (val: T) => Either<E, V>): Either<E, V> {
    return this.isRightValue ? chainFn(this.value as T) : Either(this.value as V, false)
  }

  join<V>(): Either<E, V> {
    return this.flatMap(idFunction)
  }

  map<V>(mapFn: (val: T) => V): Either<E, V> {
    return this.isRightValue
      ? Either(mapFn(this.value as T), true)
      : Either(mapFn(this.value as T), false)
  }

  takeLeft(m: Either<E, T>): Either<E, T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return apply2(this, m, function (a: Either<E, T>, b: Either<E, T>): Either<E, T> {
      return a
    })
  }

  takeRight(m: Either<E, T>): Either<E, T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return apply2(this, m, function (a: Either<E, T>, b: Either<E, T>): Either<E, T> {
      return b
    })
  }

  /* Either specifics */

  cata<Z>(leftFn: (err: E) => Z, rightFn: (val: T) => Z): Z {
    return this.isRightValue ? rightFn(this.value as T) : leftFn(this.value as E)
  }

  equals(other: Either<E, T>): boolean {
    return this.cata(
      function (left: E): boolean {
        return other.cata(equals(left), falseFunction)
      },
      function (right: T): boolean {
        return other.cata(falseFunction, equals(right))
      }
    )
  }

  fold<Z>(leftFn: (err: E) => Z, rightFn: (val: T) => Z): Z {
    return this.isRightValue ? rightFn(this.value as T) : leftFn(this.value as E)
  }

  leftMap<F>(leftMapFn: (leftVal: E) => F): Either<F, T> {
    return this.isLeft() ? Left(leftMapFn(this.value as E)) : Either<F, T>(null as T, false)
  }

  swap(): Either<T, E> {
    return this.isRight() ? Left<T, E>(this.value as T) : Right<T, E>(this.value as E)
  }

  isLeft(): boolean {
    return !this.isRight()
  }

  isRight(): boolean {
    return this.isRightValue
  }

  left(): E {
    if (this.isRightValue) {
      throw new Error('Cannot call left() on a Right.')
    }
    return this.value as E
  }

  right(): T {
    if (this.isRightValue) {
      return this.value as T
    }
    throw new Error('Cannot call right() on a Left.')
  }

  forEach(fn: (val: T) => void): void {
    this.cata(noop, fn)
  }

  forEachLeft(fn: (val: E) => void): void {
    this.cata(fn, noop)
  }

  toMaybe(): Maybe<T> {
    return this.isRight() ? Some(this.value as T) : None<T>()
  }

  /* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
  toPromise(): Promise<T> {
    return this.cata(
      function (left) { return Promise.reject(left) },
      function (right) { return Promise.resolve(right) }
    )
  }
  /* eslint-enable @typescript-eslint/prefer-promise-reject-errors */
}

const apply2 = <E, T>(a1: Either<E, T>, a2: Either<E, T>, f: (a: Either<E, T>, b: Either<E, T>) => Either<E, T>): Either<E, T> =>
  a2.ap(a1.map(curry(f, []))) // eslint-disable-line @typescript-eslint/no-unsafe-argument


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

const equals = <E, T>(a: E | T): (b: E | T) => boolean =>
  (b: E | T): boolean =>
    areEqual(a, b)

export const Either = <E, T>(val: T, isRightValue: boolean): Either<E, T> =>
  new EitherImpl<E, T>(val, isRightValue)

export const Left = <E, T>(val: E): Either<E, T> =>
  new EitherImpl<E, T>(val, false)

export const Right = <E, T>(val: T): Either<E, T> =>
  new EitherImpl<E, T>(val, true)
