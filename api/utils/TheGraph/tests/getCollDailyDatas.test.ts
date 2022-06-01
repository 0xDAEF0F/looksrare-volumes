import { it } from 'mocha'
import { expect } from 'chai'
import getCollectionDailyDatas, {
  exchangeRealVolumeForDay,
} from '../LooksRare/getCollectionDailyDatas'
import { dateToLooksUnixTimestamp } from 'api/utils/Date/dateConverter'
import staticDayActivity from './30-05-2022.json'

describe('Get all collection activity for the day.', () => {
  it('Expect first result to have the same date as the one being passed.', async () => {
    const res = await getCollectionDailyDatas(dateToLooksUnixTimestamp(new Date()))
    expect(Number(res[0].date)).to.equal(dateToLooksUnixTimestamp(new Date()))
  })
  it('Gives the same real volume as the API.', async () => {
    const realVolume_30_05_2022 = exchangeRealVolumeForDay(
      staticDayActivity.data.collectionDailyDatas
    )
    const dailyDatasCall = exchangeRealVolumeForDay(
      await getCollectionDailyDatas(dateToLooksUnixTimestamp(new Date(2022, 4, 30)))
    )
    expect(realVolume_30_05_2022).to.equal(dailyDatasCall)
  })
})
