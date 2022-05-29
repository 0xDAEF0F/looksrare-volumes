import { objectType, queryField, nonNull, stringArg } from 'nexus'
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
