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
      type: nonNull(ExchangeLog),
      resolve: async (_, __, ctx) => {
        const dailyLogs = await ctx.prisma.exchange.findUnique({
          where: { name: _.name },
          select: {
            dailyLogs: true,
          },
        })
        if (dailyLogs) return dailyLogs.dailyLogs
        return null
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

export const VolumeByMonth = objectType({
  name: 'VolumeByMonth',
  definition: (t) => {
    t.float('allVolume')
    t.float('volumeExcludingZeroFee')
  },
})

export const GetVolume = queryField('volume', {
  type: VolumeByMonth,
  args: {
    month: nonNull(intArg({ default: new Date().getUTCMonth() })),
    year: nonNull(intArg({ default: new Date().getUTCFullYear() })),
  },
  resolve: async (_root, args, ctx) => {
    const initialDate = new Date(args.year, args.month).toISOString()
    const endDate = new Date(args.year, args.month + 1).toISOString()
    const matchingResults = await ctx.prisma.exchangeLog.findMany({
      where: {
        date: {
          gte: initialDate,
          lt: endDate,
        },
      },
    })
    return {
      allVolume: matchingResults.reduce((acc, curr) => Number(curr.dailyVolume) + acc, 0),
      volumeExcludingZeroFee: matchingResults.reduce(
        (acc, curr) => Number(curr.dailyVolumeExcludingZeroFee) + acc,
        0
      ),
    }
  },
})
