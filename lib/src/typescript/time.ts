/*
MIT License

Copyright (c) 2021 Cyril Dever

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
 * @returns {number} the current Unix timestamp in milliseconds
 */
export const currentTimestampMillis = (): number => Date.now()

/**
 * Hold thread for the passed time (in milliseconds)
 * 
 * @param {number} ms - The numbe of milliseconds to wait
 * @example
 *  // Sleep for 100 ms
 *  await sleep(100)
 */
export const sleep = async (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Format a timezone-neutralized date to use in SQL statement for a TIMESTAMP or a DATETIME field, eg.
 *  `db.query('SELECT * FROM mytable WHERE mytimefield < ?', [toMySQLDateOrEmpty('Apr 8 2022')])`
 * 
 * @param {string} date - The string to use as date
 * @returns the MySQL-compatible string (or an empty string if the input is not a valid date)
 */
export const toMySQLDateOrEmpty = (date: string): string => {
  try {
    const [str, offset] = date.endsWith('Z') ? [date, 0] : [date, new Date(date).getTimezoneOffset() * 60 * 1000]
    const d = offset === 0 ? new Date(str) : new Date(new Date(str).getTime() - offset)
    return d.toJSON().slice(0, 10)
  } catch (_) {
    return ''
  }
}
