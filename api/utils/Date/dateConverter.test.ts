require('dotenv').config();
import { it } from 'mocha';
import { expect } from 'chai';
import { roundDownUtcDate } from './dateConverter';

// Can input a Date Object or a string/number
// in UNIX milliseconds
describe('Date Treatment Module', () => {
  it('Works for a Date Object.', () => {
    const timestamp = roundDownUtcDate(new Date('04-18-2022'));
    expect(timestamp).to.equal('1650240000');
  });
  it('Works for a string.', () => {
    const timestamp = roundDownUtcDate('1650501592361');
    expect(timestamp).to.equal('1650412800');
  });
  it('Works for a number.', () => {
    const timestamp = roundDownUtcDate(1650501592361);
    expect(timestamp).to.equal('1650412800');
  });
});
