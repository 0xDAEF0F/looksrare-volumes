import dotenv from 'dotenv'
import { it } from 'mocha'
import { assert, expect } from 'chai'
import to from 'await-to-js'
import getCollectionDailyDatas from '../LooksRare/getCollectionDailyDatas'
import { roundDownUtcDate } from 'api/utils/Date/dateConverter'

dotenv.config()

describe('Get all collection activity for the day.', () => {
  it('Expect first result to have the same date as the one being passed.', async () => {
    const [err, res] = await to(getCollectionDailyDatas(new Date()))
    if (err) assert.fail(err.message)
    expect(Number(res[0].date)).to.equal(roundDownUtcDate(new Date()))
  })
})
