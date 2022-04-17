import axios, { AxiosRequestConfig } from 'axios';
import { to } from 'await-to-js';

type CryptoInfo = {
  status: {
    timestamp: string;
  };
  data: {
    [id: string]: {
      id: number;
      name: string;
      symbol: string;
      max_supply: number;
      total_supply: number;
      platform: {
        token_address: string;
      };
      last_updated: string;
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          percent_change_24h: number;
        };
      };
    };
  };
};

let config: AxiosRequestConfig = {
  method: 'GET',
  url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=',
  headers: {
    'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_API_KEY as string,
  },
};

// looks ID: 17081
async function getCoinMarketCapData(assetId: string) {
  config.url += assetId;
  const [err, res] = await to(axios(config));
  if (err) throw new Error('Fail fetch.');
  const cryptoInfo = res.data as CryptoInfo;
  return {
    name: cryptoInfo.data[assetId].name,
    timestamp: cryptoInfo.status.timestamp,
    price: cryptoInfo.data[assetId].quote.USD.price,
    volume_24h: cryptoInfo.data[assetId].quote.USD.volume_24h,
    percent_change_24h: cryptoInfo.data[assetId].quote.USD.percent_change_24h,
  };
}

export type CoinMarketCapParsedObject = ReturnType<typeof getCoinMarketCapData>;
export { getCoinMarketCapData };
