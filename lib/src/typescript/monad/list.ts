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

import { areEqual, equals, idFunction, swap } from '.'
import { Maybe, None, Some } from '..'

export interface List<T> {
  /* Monad implementation */
  bind<V>(fn: (val: T) => List<V>): List<V>
  flatMap<V>(fn: (val: T) => List<V>): List<V>
  chain<V>(fn: (val: T) => List<V>): List<V>
  map<V>(fn: (val: T) => V): List<V>
  join<V>(): List<V> // if T is List<V>

  /* List specifics */
  append(list: List<T>): List<T>
  cons(a: T): List<T>
  contains(val: T): boolean
  equals(other: List<T>): boolean
  filter(fn: (val: T) => boolean): List<T>
  find(fn: (val: T) => boolean): Maybe<T>
  flatten<V>(): List<V>
  flattenMaybe<V>(): T extends Maybe<V> ? List<V> : never
  forEach(fn: (val: T) => void): void
  head(): T | undefined
  reverse(): List<T>
  size(): number
  tail(): List<T>
  toArray(): Array<T>

  /* Other needed methods and values */
  foldLeft(initialValue: List<T>): (fn: any) => List<T>
  foldRight(initialValue: List<T>): (fn: any) => List<T>
  isNil: boolean
}

/**
 * Implement a `List` instance
 *
 * @tparam `<T>` The type parameter
 * @param {T} args0 The first argument may be a `T` object [optional]
 * @param {List<T>} args1 The second argument may be a list of `T` should there be a first argument [optional]
 */
class ListImpl<T> implements List<T> {
  public isNil: boolean

  private head_: T | undefined
  private size_: number
  private tail_!: List<T>

  constructor(...args: any) {
    /* eslint-disable prefer-rest-params,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
    const head = args[0]
    const tail = args[1]
    if (args.length === 0) {
      this.isNil = true
      this.size_ = 0
    } else {
      this.isNil = false
      this.head_ = head
      this.tail_ = tail !== undefined && tail !== null ? tail : Nil()
      this.size_ = this.tail_?.size() + 1
    }
    /* eslint-enable prefer-rest-params,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
  }

  /* Monad implementation */

  bind<V>(fn: (val: T) => List<V>): List<V> {
    return this.map(fn).flatten()
  }

  chain<V>(fn: (val: T) => List<V>): List<V> {
    return this.map(fn).flatten()
  }

  flatMap<V>(fn: (val: T) => List<V>): List<V> {
    return this.map(fn).flatten()
  }

  join<V>(): List<V> {
    return this.flatMap(idFunction)
  }

  map<V>(fn: (val: T) => V): List<V> {
    return listMap(fn, this) as List<V>
  }

  /* List specifics */

  append(list: List<T>): List<T> {
    return append(this, list)
  }

  cons(head: T): List<T> {
    return new ListImpl<T>(head, this)
  }

  contains(val: T): boolean {
    return listContains(this, val)
  }

  equals(other: List<T>): boolean {
    return listEquals(this, other)
  }

  filter(fn: (val: T) => boolean): List<T> {
    return listFilter(this, fn)
  }

  find(fn: (val: T) => boolean): Maybe<T> {
    return listFind(this, fn)
  }

  flatten<V>(): List<V> {
    return foldRight(append, this, Nil<V>()) as List<V>
  }

  flattenMaybe<V>(): T extends Maybe<V> ? List<V> : never {
    return this.flatMap(d => Maybe.toList<V>(d as Maybe<V>)) as T extends Maybe<V> ? List<V> : never
  }

  forEach(fn: (val: T) => void): void {
    listForEach(fn, this)
  }

  head(): T | undefined {
    return this.head_
  }

  reverse(): List<T> {
    return listReverse(this)
  }

  size(): number {
    return this.size_
  }

  tail(): List<T> {
    return this.tail_
  }

  toArray(): Array<T> {
    return foldLeft((acc: Array<T>, e: T): Array<T> => {
      acc.push(e)
      return acc
    }, [], this) as Array<T>
  }

  /* Other needed methods */

  foldLeft(initialValue: List<T>): (fn: any) => List<T> {
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias
    return function (fn: any): List<T> {
      return foldLeft(fn, initialValue, self) as List<T>
    }
  }

  foldRight(initialValue: List<T>): (fn: any) => List<T> {
    const self = this // eslint-disable-line @typescript-eslint/no-this-alias
    return function (fn: any): List<T> {
      return foldRight(fn, self, initialValue) as List<T>
    }
  }
}

const append = <T>(self: List<T>, other: List<T>): List<T> => {
  const a = (listA: List<T>, listB: List<T>): List<T> => {
    return listA.isNil
      ? listB
      : a(listA.tail(), listB).cons(listA.head() as T)
  }
  return a(self, other)
}

const foldLeft = (fn: any, acc: any, list: any): any => {
  const fL = (innerAcc: any, innerList: any): any => {
    /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access */
    return innerList.isNil
      ? innerAcc
      : fL(fn(innerAcc, innerList.head()), innerList.tail())
    /* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access */
  }
  return fL(acc, list)
}

const foldRight = (fn: any, list: any, acc: any): any => {
  const fR = (innerList: any, innerAcc: any): any => {
    /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
    if (innerList !== undefined && innerList.size() > 0) {
      innerAcc = fn(List.of(innerList.head()), innerAcc)
    }
    return innerList.isNil
      ? innerAcc
      : fR(innerList.tail(), innerAcc)
    /* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  }
  return fR(list, acc)
}

const listContains = <T>(list: List<T>, val: T): boolean => {
  if (list.isNil) {
    return false
  }
  const lC = (l: List<T>, v: T): boolean => {
    if (l === undefined || l.isNil) {
      return false
    }
    const h = l.head()
    return areEqual(h, v)
      ? true
      : lC(l.tail(), v)
  }
  return lC(list, val)
}

const listEquals = <T>(listA: List<T>, listB: List<T>): boolean => {
  if (listA.size() !== listB.size()) {
    return false
  }
  while (!listA.isNil && !listB.isNil) { // eslint-disable-line no-loops/no-loops
    if (!equals(listA.head())(listB.head())) {
      return false
    }
    listA = listA.tail()
    listB = listB.tail()
  }
  return listA.isNil && listB.isNil
}

const listFilter = <T>(list: List<T>, fn: (val: T) => boolean): List<T> =>
  list.foldRight(Nil<T>())((a: List<T>, acc: List<T>) =>
    fn(a.head() as T) ? cons(a.head(), acc) : acc
  ).reverse()

const listFind = <T>(list: List<T>, fn: (val: T) => boolean): Maybe<T> => {
  const lF = (l: List<T>): Maybe<T> => {
    if (l.isNil) {
      return None<T>()
    }
    const h = l.head() as T
    return fn(h)
      ? Some(h)
      : lF(l.tail())
  }
  return lF(list)
}

const listForEach = <T>(effectFn: (val: T) => void, list: List<T>): void => {
  if (list.size() > 0) {
    effectFn(list.head() as T)
    listForEach(effectFn, list.tail())
  }
}

const listMap = (fn: any, list: any): any => {
  /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
  if (list.isNil) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
    return list
  }
  let newList = fn(list.head())
  list = list.tail()
  while (list.size() > 0) { // eslint-disable-line no-loops/no-loops
    const head = list.head()
    list = list.tail()
    newList = append(newList, fn(head))
  }
  return newList.reverse()
  /* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment */
}

const cons = <T>(head: T, tail: List<T>): List<T> =>
  tail.cons(head)

const listReverse = <T>(list: List<T>): List<T> =>
  list.foldLeft(Nil())(swap(cons)) // eslint-disable-line @typescript-eslint/no-unsafe-call

const fromArray = <T>(arr: Array<T>): List<T> =>
  arr.reduceRight((acc, next) => acc.cons(next), Nil<T>())

const of = <T>(val: T): List<T> =>
  new ListImpl(val)

export const List = {
  fromArray,
  of
}

export const Nil = <T>(): List<T> =>
  new ListImpl<T>()
