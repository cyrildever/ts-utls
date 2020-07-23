# ts-string-utils
String utilities in TypeScript

A few utilities to use at your discretion:
* `hashCode`: computes the equivalent of Java's hashCode;
* `splitCamelCaseWords`: put a space between each "word" found in a camel-case string, eg.
```js
import { hashCode } from 'ts-string-utils';

const h = hashCode('Hello');
console.assert(h === 69609650);

const sentence = splitCamelCaseWords('myCamelCase');
console.assert(sentence === 'my Camel Case');
```


### License

This library is distributed under an MIT license.
See the [LICENSE](LICENSE) file.


<hr />
&copy; 2020 Cyril Dever.All rights reserved.