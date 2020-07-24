import {
  chunk, flatten, groupBy,
  capitalize, fromHex, hashCode, splitCamelCaseWords, toHex, xor
} from '../../lib/src/typescript/index'

declare function expect(val: any, message?: string): any

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
    expect(found2 instanceof Array).to.be.true
    expect(typeof found2[0] === 'number').to.be.true
    expect(typeof found1 === typeof found2).to.be.true
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
describe('splitCamelCaseWords', () => {
  it('should separate words in a camel case string', () => {
    const expected = 'My Camel Case Word'
    const found = splitCamelCaseWords('MyCamelCaseWord')
    found.should.equal(expected)
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
describe('xor', () => {
  it('should apply the XOR operation on two strings of the same length', () => {
    const expected = '\u0003'
    const s1 = 'a'
    const s2 = 'b'
    const found = xor(s1, s2)
    found.should.equal(expected)

    const s3 = 'longer string' 
    expect(() => xor(s1, s3)).to.throw('strings must be of the same size')
  })
})
