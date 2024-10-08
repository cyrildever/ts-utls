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
 * Convert a byte array to its string representation of byte(s)
 * 
 * @param {Buffer} buf - The buffer to transform 
 * @returns the string representation of the octet(s), ie. one or more sequences of eight 0s or 1s
 */
export const buffer2BytesString = (buf: Buffer): string =>
  [...buf].map(_ => _.toString(2).padStart(8, '0')).join('')

/**
 * Get the byte array from an unsigned integer
 * 
 * @param {number} uint - The unsigned integer to transform
 * @returns the `Buffer`
 * @throws invalid signed integer
 */
export const int2Buffer = (uint: number): Buffer => {
  if (uint < 0) {
    throw new Error('invalid signed integer')
  }
  const bigInt = BigInt(uint)
  const buf = new ArrayBuffer(8)
  const view = new DataView(buf)
  view.setBigUint64(0, bigInt, true)
  return Buffer.from(view.buffer)
}

/**
 * 
 * @param {Buffer} buf - The buffer to split
 * @param {Buffer} delimiter - The buffer to use to cut
 * @param {boolean} returnDelim - Set to `true` should the delimiter be included in the returned array (Default: `false`)
 * @returns an array of byte arrays
 */
export const splitBuffer = (buf: Buffer, delimiter: Buffer, returnDelim = false): Array<Buffer> => {
  let idx = buf.indexOf(delimiter)
  const output = new Array<Buffer>()
  while (idx > -1) { // eslint-disable-line no-loops/no-loops
    const part = buf.subarray(0, idx)
    output.push(part)
    if (returnDelim) {
      output.push(delimiter)
      // Handle the case where the delimiter is the last item
      if (part.length === 0) {
        buf = Buffer.alloc(0)
        break
      }
    }
    buf = buf.subarray(idx + delimiter.length)
    idx = buf.indexOf(delimiter)
  }
  output.push(buf)
  return output
}

/**
 * Transform the string representation of byte(s) to a byte array
 * 
 * @param {string} bits - The string representation of the octet(s) to transform, ie. one or more sequences of eight 0s or 1s
 * @returns the `Buffer`
 * @throws not the string representation of bytes
 */
export const stringBytes2Buffer = (bits: string): Buffer => {
  if (bits.length % 8 !== 0 || !bits.match(/^[01]+$/g)) {  
    throw new Error('not the string representation of bytes')
  }
  const buf = Buffer.alloc(bits.length / 8)
  buf.writeUInt8(parseInt(bits, 2), 0)
  return buf
}
