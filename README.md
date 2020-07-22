# ts-string-utils
String utilities in TypeScript

A few utilities to use at your discretion:
* `hashCode`: computes the equivalent of Java's hashCode, eg.
```js
import { hashCode } from 'ts-string-utils';

const h = hashCode('Hello');
console.assert(h === 69609650);
```

<hr />
&copy; 2020 Cyril Dever.All rights reserved.