import axios, { AxiosRequestConfig } from 'axios'
import { to } from 'await-to-js'

type CryptoInfo = {
  status: {
    timestamp: string
  }
  data: {
    [id: string]: {
      id: number
      name: string
      symbol: string
      max_supply: number
      total_supply: number
      platform: {
        token_address: string
      }
      last_updated: string
      quote: {
        USD: {
          price: number
          volume_24h: number
          percent_change_24h: number
        }
      }
    }
  }
}

function getAxiosConfig(id: string) {
  return {
    method: 'GET',
    url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`,
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_API_KEY as string,
    },
  } as AxiosRequestConfig
}

async function getCoinMarketCapData(assetId: string) {
  const [err, res] = await to(axios(getAxiosConfig(assetId)))
  if (err) throw new Error('Fail fetch.')
  const cryptoInfo = res.data as CryptoInfo
  return {
    name: cryptoInfo.data[assetId].name,
    timestamp: cryptoInfo.status.timestamp,
    price: cryptoInfo.data[assetId].quote.USD.price,
    volume_24h: cryptoInfo.data[assetId].quote.USD.volume_24h,
    percent_change_24h: cryptoInfo.data[assetId].quote.USD.percent_change_24h,
    tokenAddress: cryptoInfo.data[assetId].platform.token_address,
    ticker: cryptoInfo.data[assetId].symbol,
    tokenCap: cryptoInfo.data[assetId].max_supply,
    tokenSupply: cryptoInfo.data[assetId].total_supply,
  }
}

export type CoinMarketCapParsedObject = ReturnType<typeof getCoinMarketCapData>
export { getCoinMarketCapData }
