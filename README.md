# ts-utils

### Utilities for TypeScript

Some functions I found useful, to borrow at your discretion:
* For arrays:
  * `chunk`: split an array into chunks of a maximum size;
  * `flatten`: transform an array of arrays of items to an array of items;
  * `groupBy`: group an array of items by some item's field;
* For numbers:
  * `euclideanDivision`: computes the euclidean division of two integers, returning the quotient and the remainder;
  * `int2Buffer`: converts an integer to its byte array equivalent;
  * `stringBytes2Buffer`: transforms a string representing one or more bytes to a byte array;
* For strings:
  * `capitalize`: capitalize the first letter of a sentence;
  * `fromHex` and `toHex`: transform hexadecimal string representation to byte array, and vice-versa;
  * `hashCode`: computes the equivalent of Java's hashCode;
  * `splitCamelCaseWords`: put a space between each "word" found in a camel-case string.

eg.
```typescript
import {
  chunk, flatten, groupBy, euclideanDivision, int2Buffer, stringBytes2Buffer,
  capitalize, fromHex, hashCode, splitCamelCaseWords, toHex, xor
} from 'ts-utils'

// For arrays

const arr = [1, 2, 3, 4, 5]
const chunked = chunk(arr)
// [[1, 2], [3, 4], [5]]
console.log(chunked)

const arrs = [[1, 2], [3, 4], [5]]
const flattened = flatten(arrs)
// [1, 2, 3, 4, 5]
console.log(flattened)

const arr = [{ field1: '1', field2: 1 }, { field1: '1', field2: 2 }, { field1: '3', field2: 3 }]
const grouped = groupBy(arr, 'field1')
console.assert(grouped['1'].length === 2)

// For numbers and bits

const n = 15, d = 2
const [q, r] = euclideanDivision(n, d)
console.assert(q === 7 && r === 1)

const buf1 = int2Buffer(1)
console.assert(buf1[0] === 1)

const b = '11011010'
const buf2 = stringBytes2Buffer(b)
console.assert(buf1[0] === 218)

// For strings

const phrase = capitalize('my sentence is capitalized')
console.assert(phrase === 'My sentence is capitalized')

const h = hashCode('Hello')
console.assert(h === 69609650)

const hexStrings = ['ff']
const buffers = hexStrings.map(fromHex)
const strings = buffers.map(toHex)
console.assert(hexStrings[0] === strings[0])

const sentence = splitCamelCaseWords('myCamelCase')
console.assert(sentence === 'my Camel Case')

const a = 'a'
const b = 'b'
const xored = xor(a, b)
console.assert(xored === '\u0003')
```

Please let me know if you have more optimized implementations.


### License

This library is distributed under an MIT license.
See the [LICENSE](LICENSE) file.


<hr />
&copy; 2020 Cyril Dever. All rights reserved.