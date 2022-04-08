import {
  buffer2BytesString, capitalize, chunk, ConvertJSON, currentTimestampMillis, flatten, groupBy, euclideanDivision, int2Buffer,
  fromHex, hashCode, shuffle, sleep, splitCamelCaseWords, range, reverse, splitBuffer, string2MySQLDate, stringBytes2Buffer, toHex, xor
} from '../../lib/src/typescript/index'

declare function expect(val: any, message?: string): any

describe('buffer2BytesString', () => {
  it('should transform a byte array in its string representation of bits', () => {
    let expected = '00000011'
    let buf = Buffer.from([3])
    let found = buffer2BytesString(buf)
    found.should.equal(expected)

    expected = '1111111100000001'
    buf = Buffer.from([255, 1])
    found = buffer2BytesString(buf)
    found.should.equal(expected)

    expected = '01110100011001010111001101110100'
    buf = Buffer.from('test', 'utf-8')
    found = buffer2BytesString(buf)
    found.should.equal(expected)
  })
})
describe('capitalize', () => {
  it('should put the first letter in upper case if any', () => {
    const expected = 'My capitalized sentence'
    const found = capitalize('my capitalized sentence')
    found.should.equal(expected)

    ''.should.equal(capitalize(''))
  })
})
describe('chunk', () => {
  it('should split an array into pieces of the maximum wished size', () => {
    const arr = [1, 2, 3, 4, 5]
    const expected = [[1, 2], [3, 4], [5]]
    const found = chunk(arr, 2)

    found.should.have.lengthOf(3)
    found[0].should.eqls([1, 2])
    found[1].should.eqls([3, 4])
    found[2].should.eqls([5])
    found.should.eqls(expected)
  })
})
describe('ConvertJSON.toClass', () => {
  it('should return the appropriate object from a JSON string', () => {
    class MyClass {
      private name = ''
      public style?: string = undefined

      public getName(): string {
        return this.name
      }

      public getStyle(): string | undefined {
        return this.style
      }
    }
    const src = '{"name":"MyName"}'
    const found = ConvertJSON(src).toClass(MyClass)
    found.getName().should.equal('MyName')
  })
})
describe('euclideanDivision', () => {
  it('should return the correct quotient and remainder', () => {
    const numerator = 15, denominator = 2
    const [quotient, remainder] = euclideanDivision(numerator, denominator)
    quotient.should.equal(7)
    remainder.should.equal(1)
  })
  it('should throw an error when dividing by zero', () => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    expect(() => euclideanDivision(23, 0)).to.throw('division by zero') // eslint-disable-line @typescript-eslint/no-unsafe-call
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  })
})
describe('flatten', () => {
  it('should flatten an array of arrays correctly', () => {
    const expected = [1, 2, 3, 4, 5]
    const arrs = [[1, 2], [3, 4], [5]]
    const found = flatten(arrs)
    found.should.eqls(expected)
  })
  it('should infer types when possible', () => {
    const arrs = [[1, 2], [3, 4], [5]]
    const found1 = flatten<number>(arrs)
    const found2 = flatten(arrs)
    found1.should.eqls(found2)
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    expect(found2 instanceof Array).to.be.true
    expect(typeof found2[0] === 'number').to.be.true
    expect(typeof found1 === typeof found2).to.be.true
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  })
})
describe('groupBy', () => {
  it('should regroup objects on field values appropriately', () => {
    const arr = [{ field1: '1', field2: 1 }, { field1: '1', field2: 2 }, { field1: '3', field2: 3 }]
    const grouped = groupBy(arr, 'field1')
    grouped['1'].should.have.lengthOf(2)
    grouped['3'].should.have.lengthOf(1)
    Object.entries(grouped).map(([key, value]) => {
      if (key === '1') {
        value.should.have.lengthOf(2)
      } else if (key === '3') {
        value.should.have.lengthOf(1)
      }
    })
  })
  it('should group any custom type on a chosen field', () => {
    interface MyType {
      name: string
      value: any
    }
    const objA: MyType = {
      name: 'A',
      value: 1
    }
    const objB: MyType = {
      name: 'B',
      value: 1
    }
    const arr = [objA, objB]
    const grouped = groupBy(arr, 'value')
    grouped[1].should.have.lengthOf(2)
  })
})
describe('hashCode', () => {
  it('should be deterministic', () => {
    const data = 'my string to hash'
    const expected = -1920368776
    const found1 = hashCode(data)
    const found2 = hashCode(data)
    found1.should.equal(found2)
    found1.should.equal(expected)

    const hello = 69609650
    const found = hashCode('Hello')
    found.should.equal(hello)

    const empty = hashCode('')
    empty.should.equal(0)
  })
})
describe('int2Buffer', () => {
  it('should return the appropriate buffer', () => {
    const i = 180969
    const expected = Buffer.from([233, 194, 2, 0, 0, 0, 0, 0])
    const found = int2Buffer(i)
    found.should.eqls(expected)
  })
})
describe('range', () => {
  it('should provide a list of integers', () => {
    let expected = [0, 1, 2, 3, 4]
    let found = range(0, 5)
    found.should.eqls(expected)

    expected = [2, 3, 4, 5]
    found = range(2, 4)
    found.should.eqls(expected)

    found = range(1, 0)
    found.should.be.empty
  })
  it('should adapt the list to the step size', () => {
    const expected1 = [0, 1, 2, 3, 4]
    let found = range(0, 5, 1)
    found.should.eqls(expected1)

    const expected2 = [0, 2, 4]
    found = range(0, 5, 2)
    found.should.eqls(expected2)

    const expected5 = [0]
    found = range(0, 5, 5)
    found.should.eqls(expected5)
  })
})
describe('reverse', () => {
  it('should reverse the order of the characters', () => {
    const str = 'abcd'
    const expected = 'dcba'
    const found = reverse(str)
    found.should.equal(expected)
  })
})
describe('shuffle', () => {
  it('should shuffle randomly a string', () => {
    const str = '1234568790abcdefghijklmnopqrstuvwxyz'
    const found1 = shuffle(str)
    found1.should.not.equal(str)
    const found2 = shuffle(str)
    found2.should.not.equal(str)
    found2.should.not.equal(found1)
    found1.should.have.lengthOf(str.length)
    found2.should.have.lengthOf(found1.length)
  })
})
describe('splitBuffer', () => {
  it('should cut a byte array in parts using another byte array as delimiter', () => {
    const buf = Buffer.from([0, 1, 128, 2, 3])
    const delimiter = Buffer.from([128])
    const found1 = splitBuffer(buf, delimiter)
    found1.should.have.lengthOf(2)
    found1[0].should.eqls(Buffer.from([0, 1]))
    found1[1].should.eqls(Buffer.from([2, 3]))
    const found2 = splitBuffer(buf, delimiter, true)
    found2.should.have.lengthOf(3)
    found2[0].should.eqls(Buffer.from([0, 1]))
    found2[1].should.eqls(delimiter)
    found2[2].should.eqls(Buffer.from([2, 3]))

    const buf2 = Buffer.from([0, 1, 127, 128, 2, 3, 127, 128])
    const delimiter2 = Buffer.from([127, 128])
    const found3 = splitBuffer(buf2, delimiter2, true)
    found3.should.have.lengthOf(5)
    found3[0].should.eqls(Buffer.from([0, 1]))
    found3[1].should.eqls(delimiter2)
    found3[2].should.eqls(Buffer.from([2, 3]))
    found3[3].should.eqls(delimiter2)
    found3[4].should.be.empty
  })
})
describe('splitCamelCaseWords', () => {
  it('should separate words in a camel case string', () => {
    const expected = 'My Camel Case Word'
    const found = splitCamelCaseWords('MyCamelCaseWord')
    found.should.equal(expected)
  })
})
describe('string2MySQLDate', () => {
  it('should return the appropriate formatted string from a Date', () => {
    const expected = '2022-04-08'
    let found = string2MySQLDate('Apr 8 2022')
    found.should.equal(expected)

    found = string2MySQLDate('2022-04-08T23:59:59.000Z')
    found.should.equal(expected)

    found = string2MySQLDate('2022-04-08T23:59:59.000')
    found.should.equal(expected)

    found = string2MySQLDate('Fri Apr 8 2022 00:00:00 GMT+0200')
    found.should.equal(expected)
  })
})
describe('stringBytes2Buffer', () => {
  it('should transform a byte in string to a buffer', () => {
    const byte = '11011010'
    const expected = Buffer.from([218])
    const found = stringBytes2Buffer(byte)
    found.should.eqls(expected)
  })
  it('should throw an error when the string is not an octet', () => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    expect(() => stringBytes2Buffer('01')).to.throw('not the string representation of bytes') // eslint-disable-line @typescript-eslint/no-unsafe-call
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  })
})
describe('xor', () => {
  it('should apply the XOR operation on two strings of the same length', () => {
    const expected = '\u0003'
    const s1 = 'a'
    const s2 = 'b'
    const found = xor(s1, s2)
    found.should.equal(expected)
  })
  it('should throw an error when strings are not of the same length', () => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    expect(() => xor('short', 'longer string')).to.throw('strings must be of the same size') // eslint-disable-line @typescript-eslint/no-unsafe-call
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  })
})
describe('Hex functions', () => {
  describe('fromHex', () => {
    it('should read an hexadecimal string', () => {
      const expected = Buffer.from([255])
      const ff = 'ff'
      const found = fromHex(ff)
      found.should.eqls(expected)
    })
  })
  describe('toHex', () => {
    it('should create the right hexadecimal string', () => {
      const expected = 'ff'
      const ff = Buffer.from([255])
      const found = toHex(ff)
      found.should.equal(expected)
    })
  })
  it('should work back-and-forth', () => {
    const hexStrings = ['ff']
    const buffers = hexStrings.map(fromHex)
    const strings = buffers.map(toHex)
    strings.should.eqls(hexStrings)
  })
})
describe('Time functions', () => {
  describe('sleep', () => {
    it('should hold the thread for the wanted time', async () => {
      const ts1 = currentTimestampMillis()
      const hold = 100
      await sleep(hold)
      const ts2 = currentTimestampMillis()
      ts2.should.be.gte(ts1 + hold)
    })
  })
})
