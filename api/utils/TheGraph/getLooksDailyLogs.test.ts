// require('dotenv').config();
import dotenv from 'dotenv'
import { it } from 'mocha'
import { assert, expect } from 'chai'
import to from 'await-to-js'
import { getLooksExchangeDailyDatas } from './getLooksDailyLogs'

dotenv.config()

describe('Query LooksRare Subgraph Daily Datas', () => {
  it('Expect object to not be null.', async () => {
    const [err, res] = await to(getLooksExchangeDailyDatas('1650412800'))
    if (err) assert.fail(err.message)
    expect(res).to.not.be.null
  })
})
