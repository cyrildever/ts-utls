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
