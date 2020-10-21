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
 * Put the first letter of a sentence in upper case
 * 
 * @param {string} s - The sentence to capitalize
 * @returns the capitalized string
 */
export const capitalize = (s: string): string =>
  s.length > 0 ? s.replace(/^./, s[0].toUpperCase()) : s

/**
 * Returns the byte array from the passed hexadecimal string, or an empty buffer if failed
 * 
 * @param {string} s - The hexadecimal string representation
 * @returns the corresponding byte array
 */
export const fromHex = (s: string): Buffer => {
  try {
    return Buffer.from(s, 'hex')
  } catch (e) {
    return Buffer.alloc(0)
  }
}

/**
 * Compute the equivalent of Java's hashCode for the passed string
 * 
 * @param {string} s - The string to use
 * @returns the hashCode
 */
export const hashCode = (s: string): number =>
  Array.from(s).reduce((h: number, c: string) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)

/**
 * Shuffle the characters of the passed string
 * 
 * @param {string} s - The string to use
 * @returns the shuffled string
 * @see http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
 */
export const shuffle = (s: string): string =>
  Array.from(s).reverse().reduce((shuffled, c, idx) => {
    const j = Math.floor(Math.random() * (idx + 1))
    const tmp = shuffled.split('')
    tmp[idx] = shuffled[j]
    tmp[j] = c
    return tmp.join('')
  })

/**
 * Split a camel case string into a sequence of words, eg. MyCamelCaseWord => My Camel Case Word
 * 
 * @param {string} s - The camel case string to use
 * @returns the sentence
 */
export const splitCamelCaseWords = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1 $2')

/**
 * Build the hexadecimal string representation of the passed byte array
 * 
 * @param {Buffer} b - The byte array array to use
 * @returns the hexadecimal string
 */
export const toHex = (b: Buffer): string => b.toString('hex')

/**
 * Applies the XOR function to two strings in the sense that each charCode are XORed
 * 
 * @param {string} s1 - The first string to use
 * @param {string} s2 - The second string
 * @returns the XORed result
 * @throws strings must be of the same size
 */
export const xor = (s1: string, s2: string): string => {
  if (s1.length !== s2.length) {
    throw new Error('strings must be of the same size')
  }
  return Array.from(s1).reduce((xored, c, idx) => xored + String.fromCharCode(c.charCodeAt(0) ^ s2.charCodeAt(idx)), '')
}
