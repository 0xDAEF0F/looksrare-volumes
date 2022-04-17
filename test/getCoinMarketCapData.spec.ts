require('dotenv').config();
import { it } from 'mocha';
import { assert, expect } from 'chai';
import { getCoinMarketCapData } from '../api/utils/getCoinMarketCapData';
import type { CoinMarketCapParsedObject } from '../api/utils/getCoinMarketCapData';

describe('CoinMarketCap', () => {
  it('Test for nullity.', async () => {
    const looksData = await getCoinMarketCapData('17081').catch((err) =>
      console.log(err)
    );
    expect(looksData).to.not.be.null;
  });
});
