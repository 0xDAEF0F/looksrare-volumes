import dotenv from 'dotenv'
import { it } from 'mocha'
import { expect } from 'chai'
import getCollectionDailyDatas from '../LooksRare/getCollectionDailyDatas'
import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import { getRealVolumeForADay } from 'prisma/scripts/seedVolumeExcludingZeroFee'

dotenv.config()

describe('Get all collection activity for the day.', () => {
  it('Expect first result to have the same date as the one being passed.', async () => {
    const res = await getCollectionDailyDatas(dateToLooksUnixTimestamp(new Date()))
    console.log(getRealVolumeForADay(res))
    expect(Number(res[0].date)).to.equal(dateToLooksUnixTimestamp(new Date()))
  })
})
