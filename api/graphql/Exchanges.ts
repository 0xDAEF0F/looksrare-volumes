import { objectType, queryField, nonNull, stringArg } from 'nexus'
import { Exchange, ExchangeLog } from 'nexus-prisma'

export const ExchangeObject = objectType({
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
      type: nonNull(ExchangeLogObject),
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

export const ExchangeLogObject = objectType({
  name: ExchangeLog.$name,
  description: ExchangeLog.$description,
  definition: (t) => {
    t.field(ExchangeLog.id)
    t.field(ExchangeLog.date)
    t.field(ExchangeLog.dailyVolume)
    t.field(ExchangeLog.dailyVolumeExcludingZeroFee)
    t.field(ExchangeLog.exchangeId)
  },
})

export const ExchangeQuery = queryField('exchange', {
  type: ExchangeObject,
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
