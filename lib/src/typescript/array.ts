/*
MIT License

Copyright (c) 2020 Cyril Dever

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

/**
 * Split an array into chunks of the passed size
 * 
 * @param {T[]} arr - The array to split
 * @param {number} chunkSize - The maximum size of chunks
 * @returns the chunked array of arrays
 */
export const chunk = <T>(arr: ReadonlyArray<T>, chunkSize: number): Array<Array<T>> =>
  arr.reduce(
    (segments, _, idx) =>
      idx % chunkSize === 0
        ? [...segments, arr.slice(idx, idx + chunkSize)] as Array<Array<T>>
        : segments,
    new Array<Array<T>>()
  )

/**
 * Flatten an array of arrays of items into an array of items
 * 
 * @param {T[][]} arrs - The array of arrays to flatten
 * @returns the flattened array of items
 */
export const flatten = <T>(arrs: Array<Array<T>>): Array<T> =>
  ([] as Array<T>).concat(...arrs)

/**
 * Group an array of objects by some field acting as key
 * 
 * @param {T[]} arr - The array of objects
 * @param {K} key - The key to use
 * @returns the map array grouped by key
 */
export const groupBy = <T extends any, K extends keyof T>(arr: Array<T>, key: K): Record<T[K], Array<T>> =>
  arr.reduce(
    (acc, obj) => {
      const v = obj[key]
      acc[v] = (acc[v] || []).concat(obj) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
      return acc
    }, {} as Record<T[K], Array<T>>
  )

/**
 * Returns a range of integers
 * 
 * It is the equivalent of a for-loop with `i = start` and `i < start + size` with `i = i + step` at the end of each round
 * 
 * @param {number} start - The starting point
 * @param {number} end - The number of items to return (not included)
 * @param {number} step - The (optional) step size between numbers (Default: 1)
 * @returns the array of integers
 */
export const range = (start: number, end: number, step = 1): Array<number> =>
  [...Array(Math.ceil(end / step)).keys()].map(i => i * step + start)
