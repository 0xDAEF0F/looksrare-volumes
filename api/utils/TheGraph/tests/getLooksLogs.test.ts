import dotenv from 'dotenv'
import { it } from 'mocha'
import { assert, expect } from 'chai'
import to from 'await-to-js'
import { getLastXDaysLogs } from '../LooksRare/getLastLogs'
import { roundDownUtcDate } from 'api/utils/Date/dateConverter'

dotenv.config()

describe('Get Looks Exchange Info for X days.', () => {
  it('Expect first object to have the same date.', async () => {
    const [err, data] = await to(Promise.all(getLastXDaysLogs(3)))
    if (err) assert.fail(err.message)
    expect(Number(data[0].date)).to.equal(roundDownUtcDate(new Date()))
  })
})
