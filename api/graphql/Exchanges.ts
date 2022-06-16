import { mean } from 'lodash'
import { objectType, queryField, nonNull, intArg } from 'nexus'
import { Exchange, ExchangeLog } from 'nexus-prisma'

export const ExchangeGql = objectType({
  name: Exchange.$name,
  description: Exchange.$description,
  definition(t) {
    t.field(Exchange.id)
    t.field(Exchange.name)
    t.field(Exchange.ticker)
    t.field(Exchange.tokenAddress)
    t.field(Exchange.tokenCap)
    t.field(Exchange.tokenSupply)
    t.list.field('dailyLogs', {
      type: ExchangeLogGql,
      resolve: async (_, __, ctx) => {
        return await ctx.prisma.exchangeLog.findMany()
      },
    })
  },
})

export const ExchangeLogGql = objectType({
  name: ExchangeLog.$name,
  description: ExchangeLog.$description,
  definition: (t) => {
    t.field(ExchangeLog.date)
    t.field(ExchangeLog.dailyVolume)
    t.field(ExchangeLog.dailyVolumeExcludingZeroFee)
    t.field(ExchangeLog.priceHigh)
    t.field(ExchangeLog.priceLow)
  },
})

export const ExchangeQuery = queryField('exchange', {
  type: ExchangeGql,
  resolve: (_root, _args, ctx) => {
    return ctx.prisma.exchange.findUnique({
      where: {
        ticker: 'LOOKS',
      },
    })
  },
})

export const VolumeByMonthT = objectType({
  name: 'VolumeByMonth',
  definition: (t) => {
    t.string('currency')
    t.float('allVolume')
    t.float('volumeExcludingZeroFee')
    t.float('volumeInUSD')
  },
})

export const VolumeByMonth = queryField('volume', {
  type: VolumeByMonthT,
  args: {
    month: nonNull(intArg({ default: new Date().getUTCMonth() })),
    year: nonNull(intArg({ default: new Date().getUTCFullYear() })),
  },
  resolve: async (_root, args, ctx) => {
    const initialDate = getISODate(args.year, args.month)
    const endDate = getISODate(args.year, args.month + 1)
    const matchingResults = await ctx.prisma.exchangeLog.findMany({
      where: {
        date: {
          gte: initialDate,
          lt: endDate,
        },
      },
      select: {
        ethPriceHigh: true,
        ethPriceLow: true,
        dailyVolume: true,
        dailyVolumeExcludingZeroFee: true,
      },
    })
    return reduceVolumesFromLogs(matchingResults)
  },
})

type VolumeType = {
  dailyVolume: number
  dailyVolumeExcludingZeroFee: number | null
  ethPriceHigh: number | null
  ethPriceLow: number | null
}

function reduceVolumesFromLogs(arr: VolumeType[]) {
  const startingAccumulator = {
    currency: 'ETH',
    rawVolume: 0.0,
    volumeExcludingZeroFee: 0,
    volumeInUSD: 0,
  }

  return arr.reduce((acc, curr) => {
    const { ethPriceHigh, ethPriceLow, dailyVolume, dailyVolumeExcludingZeroFee } = curr
    const { rawVolume, currency, volumeExcludingZeroFee, volumeInUSD } = acc

    // calculate eth/usd average for the day times the real volume
    const ethAvg = ethPriceHigh && ethPriceLow ? mean([ethPriceHigh, ethPriceLow]) : 0
    const usdVol = Number(dailyVolumeExcludingZeroFee) * ethAvg

    return {
      currency: currency,
      rawVolume: rawVolume + Number(dailyVolume),
      volumeExcludingZeroFee:
        volumeExcludingZeroFee + Number(dailyVolumeExcludingZeroFee) || 0,
      volumeInUSD: volumeInUSD + usdVol,
    }
  }, startingAccumulator)
}

function getISODate(year: number, month: number) {
  const date = new Date(year, month)
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString()
}
