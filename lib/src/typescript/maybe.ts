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

export interface Maybe<T> {
  getOrElse(val: T): T
  isNone(): boolean
  isSome(): boolean
  some(): T
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
}

const isNothing = (val: any): boolean =>
  val === null || val === undefined

export const Some = <T>(val: T): Maybe<T> =>
  new MaybeImpl(true, val)

export const None = <T>(): Maybe<T> =>
  new MaybeImpl(false, null as T)
