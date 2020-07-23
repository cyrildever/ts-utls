import {
  capitalize, flatten, hashCode, splitCamelCaseWords, fromHex, toHex
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
