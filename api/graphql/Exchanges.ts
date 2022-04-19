import { objectType, queryField, list, nonNull, stringArg, mutationField } from 'nexus';
import { Exchange } from 'nexus-prisma';

export const ExchangeObject = objectType({
  name: Exchange.$name,
  description: Exchange.$description,
  definition(t) {
    t.field(Exchange.id);
    t.field(Exchange.name);
  },
});

export const ExchangeQuery = queryField('exchanges', {
  type: nonNull(list(nonNull(ExchangeObject))),
  resolve: (_root, _args, ctx) => {
    return ctx.prisma.exchange.findMany();
  },
});

export const AddExchange = mutationField('addExchange', {
  type: ExchangeObject,
  args: {
    name: nonNull(stringArg()),
  },
  resolve: (_, args, ctx) => {
    return ctx.prisma.exchange.create({
      data: {
        name: args.name,
      },
    });
  },
});
