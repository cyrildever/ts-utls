# ts-string-utils

### String utilities in TypeScript

Some functions I found useful, to borrow at your discretion:
* `capitalize`: capitalize the first letter of a sentence;
* `fromHex` and `toHex`: transform hexadecimal string representation to byte array, and vice-versa;
* `hashCode`: computes the equivalent of Java's hashCode;
* `splitCamelCaseWords`: put a space between each "word" found in a camel-case string.

eg.
```typescript
import * from 'ts-string-utils'

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
```

Please let me know if you have more optimized implementations.


### License

This library is distributed under an MIT license.
See the [LICENSE](LICENSE) file.


<hr />
&copy; 2020 Cyril Dever. All rights reserved.