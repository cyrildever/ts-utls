import { capitalize, hashCode, splitCamelCaseWords } from '../../lib/src/typescript/index'

describe('capitalize', () => {
  it('should put the first letter in upper case if any', () => {
    const expected = 'My capitalized sentence'
    const found = capitalize('my capitalized sentence')
    found.should.equal(expected)

    ''.should.equal(capitalize(''))
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
describe('spliCamelCaseWords', () => {
  it('should separate words in a camel case string', () => {
    const expected = 'My Camel Case Word'
    const found = splitCamelCaseWords('MyCamelCaseWord')
    found.should.equal(expected)
  })
})
