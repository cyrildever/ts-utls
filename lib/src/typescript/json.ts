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

export interface TargetedClass<T> {
  new(): T
}

export interface ConvertJSON {
  /**
   * @returns an instance of the targeted class type
   */
  toClass: <T extends object>(using: TargetedClass<T>) => T
}

/* eslint-disable no-prototype-builtins,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */

/**
 * Transforms a JSON to the desired object
 * 
 * @param {string} from - The JSON source
 * @type {T} cls - The targeted type that extends the base object
 * @returns the instance of the object
 *
 * @example
 */
const toClass = (from: string) => <T extends object>(cls: TargetedClass<T>): T => {
  const klass = new cls()
  const json = JSON.parse(from)
  const keys = Object.keys(klass)
  keys.forEach(key => {
    if (json.hasOwnProperty(key)) {
      klass[key as keyof T] = json[key]
    }
  })
  return klass
}

/* eslint-enable no-prototype-builtins,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */

/**
 * Base class for converting JSON string to custom type
 * 
 * @param {string} str - The JSON source
 */
export const ConvertJSON = (str: string): ConvertJSON => ({
  toClass: toClass(str)
})
