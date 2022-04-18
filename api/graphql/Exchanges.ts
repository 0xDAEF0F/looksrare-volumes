import { objectType, queryField, list, nonNull, stringArg, mutationField } from 'nexus';

export const Exchange = objectType({
  name: 'Exchange',
  description: 'This represents an exchange and its information.',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
  },
});

export const ExchangeQuery = queryField('exchanges', {
  // this looks funky
  type: nonNull(list(nonNull(Exchange))),
  resolve: (_root, _args, ctx) => {
    return ctx.prisma.exchange.findMany();
  },
});

export const AddExchange = mutationField('addExchange', {
  type: Exchange,
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
