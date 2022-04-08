# ts-utls

![Github tag (latest by date)](https://img.shields.io/github/v/tag/cyrildever/ts-utls)
![npm](https://img.shields.io/npm/dw/ts-utls)
![Github last commit](https://img.shields.io/github/last-commit/cyrildever/ts-utls)
![Github issues](https://img.shields.io/github/issues/cyrildever/ts-utls)
![NPM](https://img.shields.io/npm/l/ts-utls)

ts-utls is a small TypeScript library where I put all useful stuff I regularly need in my projects. \
Feel free to use at your discretion with the apppropriate license mentions.

_NB: I've developed the same kind of libraries for both [Go](https://github.com/cyrildever/go-utls) and [Python](https://pypi.org/project/py-utls/)._

### Usage

```console
npm i ts-utls
```

This library contains the following functions:
* For arrays:
  * `chunk`: split an array into chunks of a maximum size;
  * `flatten`: transform an array of arrays of items to an array of items;
  * `groupBy`: group an array of items by some item's field;
  * `range`: return a list of integers;
* For bits and buffers:
  * `buffer2BytesString`: transform a byte array to its string representation of byte(s);
  * `int2Buffer`: convert an integer to its byte array equivalent;
  * `splitBuffer`: split a byte array using a passed byte array;
  * `stringBytes2Buffer`: transform a string representing one or more bytes to a byte array;
* For JSON:
  * `ConvertJSON.toClass`: allows casting a JSON string to the targeted class instance;
* For numbers:
  * `euclideanDivision`: compute the euclidean division of two integers, returning the quotient and the remainder;
* For strings:
  * `capitalize`: capitalize the first letter of a sentence;
  * `fromHex` and `toHex`: transform hexadecimal string representation to byte array, and vice-versa;
  * `hashCode`: compute the equivalent of Java's hashCode;
  * `reverse`: reverse the order of characters;
  * `shuffle`: randomly shuffle the characters;
  * `splitCamelCaseWords`: put a space between each "word" found in a camel-case string;
  * `xor`: apply the XOR logical function to two strings in the sense that each charCode is xored;
* For time:
  * `currentTimestampMillis`: return the current Unix timestamp in milliseconds;
  * `sleep`: hold the current thread for a while;
  * `toMySQLDateOrEmpty`: transform any date string to a MySQL-compatible date for SQL statement.

eg.
```typescript
import {
  buffer2BytesString, capitalize, chunk, ConvertJSON, currentTimestampMillis, flatten, groupBy, euclideanDivision, 
  int2Buffer, fromHex, hashCode, shuffle, sleep, splitCamelCaseWords, range, reverse, splitBuffer, stringBytes2Buffer, toHex, toMySQLDateOrEmpty, xor
} from 'ts-utls'

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

const firstFive = range(0, 5)
// [0, 1, 2, 3, 4]
console.log(firstFive)
const evenBefore10 = range(0, 10, 2)
// [0, 2, 4, 5, 6, 8]
console.log(evenBefore10)

// For bits and buffers

const buf0 = Buffer.from([0, 1, 128, 2, 3])
const delimiter = Buffer.from([128])
const splitsWithout = splitBuffer(buf0, delimiter, false)
// [[0, 1], [2, 3]]
console.log(splitsWithout)
const splitsWith = splitBuffer(buf0, delimiter, true)
// [[0, 1], [128], [2, 3]]
console.log(splitsWith)

const buf1 = int2Buffer(1)
console.assert(buf1[0] === 1)

const str = '11011010'
const buf2 = stringBytes2Buffer(str)
console.assert(buf1[0] === 218)
const str2 = buffer2BytesString(buf2)
console.assert(str === str2)

// For JSON

const myClass = ConvertJSON(jsonStr).toClass(MyClass)
assert(myClass instanceof MyClass)

// For numbers

const n = 15, d = 2
const [q, r] = euclideanDivision(n, d)
console.assert(q === 7 && r === 1)

// For strings

const phrase = capitalize('my sentence is capitalized')
console.assert(phrase === 'My sentence is capitalized')

const h = hashCode('Hello')
console.assert(h === 69609650)

const hexStrings = ['ff']
const buffers = hexStrings.map(fromHex)
const strings = buffers.map(toHex)
console.assert(hexStrings[0] === strings[0])

const toReverse = 'abcd'
const reversed = reverse(toReverse)
console.assert(reversed === 'dcba')

const str = 'abcd'
const shuffled = shuffle(str)
console.assert(str.length === shuffled.length)
console.assert(str !== shuffled)

const sentence = splitCamelCaseWords('myCamelCase')
console.assert(sentence === 'my Camel Case')

const a = 'a'
const b = 'b'
const xored = xor(a, b)
console.assert(xored === '\u0003')

// For time

const ts = currentTimestampMillis()
await sleep(100)
console.assert(currentTimestampMillis() > ts + 100)

const date = 'Fri Apr 8 2022 01:00:00 GMT+0200'
const mysqlDatetime = toMySQLDateOrEmpty(date, true)
console.assert(mysqlDatetime === '2022-04-08 01:00:00')
```

Please let me know if you have more optimized implementations of any of my stuff.


### Dependencies

To run the tests, you would need to install [`live-server`](https://www.npmjs.com/package/live-server):
```console
npm i -g live-server
```


### License

This library is distributed under an MIT license.
See the [LICENSE](LICENSE) file.


<hr />
&copy; 2020-2022 Cyril Dever. All rights reserved.