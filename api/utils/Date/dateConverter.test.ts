import { it } from 'mocha'
import { expect } from 'chai'
import { dateToLooksUnixTimestamp } from './dateConverter'

// Can input a Date Object or a string/number
// in UNIX milliseconds
describe('Date Treatment Module', () => {
  it('Works for a Date Object.', () => {
    const timestamp = dateToLooksUnixTimestamp(new Date('04-18-2022'))
    expect(timestamp).to.equal(1650240000)
  })
  it('Works for a number.', () => {
    const timestamp = dateToLooksUnixTimestamp(new Date(1650501592361))
    expect(timestamp).to.equal(1650412800)
  })
})
