import dotenv from 'dotenv';
import { it } from 'mocha';
import { assert, expect } from 'chai';
import { getCoinMarketCapData } from './getCryptoData';
import type { CoinMarketCapParsedObject } from './getCryptoData';
import to from 'await-to-js';

dotenv.config();

describe('CoinMarketCap', async () => {
  let looksData: Awaited<CoinMarketCapParsedObject>;

  before(async () => {
    const [err, res] = await to(getCoinMarketCapData('17081'));
    if (err) assert.fail(err.message);
    looksData = res;
  });

  it('Test for nullity.', () => {
    expect(looksData).to.not.be.null;
  });
  it('Test for property name.', () => {
    expect(looksData).to.have.property('name', 'LooksRare');
  });
});
