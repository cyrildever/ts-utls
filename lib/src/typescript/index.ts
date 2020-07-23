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
 * @param s - The sentence to capitalize
 * @returns the capitalized string
 */
export const capitalize = (s: string): string =>
  s.length > 0 ? s.replace(/^./, s[0].toUpperCase()) : s

/**
 * Compute the equivalent of Java's hashCode for the passed string
 * 
 * @param s - The string to use
 * @returns the hashCode
 */
export const hashCode = (s: string): number =>
  Array.from(s).reduce((h: number, c: string) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)

/**
 * Split a camel case string into a sequence of words, eg. MyCamelCaseWord => My Camel Case Word
 * 
 * @param s - The camel case string to use
 * @returns the sentence
 */
export const splitCamelCaseWords = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
