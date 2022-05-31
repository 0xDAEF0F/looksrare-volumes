import { objectType, queryField, nonNull, stringArg, intArg } from 'nexus'
import { Exchange as ExchangeModel, ExchangeLog as ExchangeLogModel } from 'nexus-prisma'

export const Exchange = objectType({
  name: ExchangeModel.$name,
  description: ExchangeModel.$description,
  definition(t) {
    t.field(ExchangeModel.id)
    t.field(ExchangeModel.name)
    t.field(ExchangeModel.ticker)
    t.field(ExchangeModel.tokenAddress)
    t.field(ExchangeModel.tokenCap)
    t.field(ExchangeModel.tokenSupply)
    t.list.field('dailyLogs', {
      type: ExchangeLog,
      resolve: async (_, __, ctx) => {
        const exchange = await ctx.prisma.exchange.findUnique({
          where: { ticker: 'LOOKS' },
          include: { dailyLogs: true },
        })
        if (!exchange) return null
        return exchange.dailyLogs
      },
    })
  },
})

export const ExchangeLog = objectType({
  name: ExchangeLogModel.$name,
  description: ExchangeLogModel.$description,
  definition: (t) => {
    t.field(ExchangeLogModel.id)
    t.field(ExchangeLogModel.date)
    t.field(ExchangeLogModel.dailyVolume)
    t.field(ExchangeLogModel.dailyVolumeExcludingZeroFee)
    t.field(ExchangeLogModel.exchangeId)
    t.field(ExchangeLogModel.priceHigh)
    t.field(ExchangeLogModel.priceLow)
  },
})

export const ExchangeQuery = queryField('exchange', {
  type: Exchange,
  args: {
    ticker: nonNull(stringArg()),
  },
  resolve: (_root, _args, ctx) => {
    return ctx.prisma.exchange.findUnique({
      where: {
        ticker: _args.ticker,
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
        date: true,
        dailyVolume: true,
        dailyVolumeExcludingZeroFee: true,
        ethPriceHigh: true,
        ethPriceLow: true,
      },
    })
    return {
      allVolume: Math.floor(
        matchingResults.reduce((acc, curr) => Number(curr.dailyVolume) + acc, 0)
      ),
      volumeExcludingZeroFee: Math.floor(
        matchingResults.reduce(
          (acc, curr) => (curr.dailyVolumeExcludingZeroFee || 0) + acc,
          0
        )
      ),
      currency: 'ETH',
      volumeInUSD: Math.floor(
        matchingResults.reduce((acc, curr) => {
          const ethAvgPriceUSD =
            curr.ethPriceHigh && (curr.ethPriceHigh + curr.ethPriceLow) / 2
          if (!ethAvgPriceUSD) return acc
          return curr?.dailyVolumeExcludingZeroFee * ethAvgPriceUSD + acc
        }, 0)
      ),
    }
  },
})

function getISODate(year: number, month: number) {
  const date = new Date(year, month)
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString()
}

// function reduceExchangeLogsVolume(logs: typeof ExchangeLog[]) {
//   const initialObj = {
//     allVolume: 0,
//     volumeExcludingZeroFee: 0,
//     volumeInUSD: 0,
//     currency: 'ETH',
//   }

//   return logs.reduce((acc, curr) => {
//     const { dailyVolume, volumeExcludingZeroFee, } = curr
//   }, initialObj)
// }
