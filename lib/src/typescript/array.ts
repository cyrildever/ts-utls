/**
 * Flatten an array of arrays of items into an array of items
 * 
 * @param {T[][]} arrs - The array of arrays to flatten
 * @returns the flattened array of items
 */
export const flatten = <T>(arrs: Array<Array<T>>): Array<T> =>
  ([] as Array<T>).concat(...arrs)
