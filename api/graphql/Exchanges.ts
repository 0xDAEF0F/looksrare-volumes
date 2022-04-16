import { objectType, queryField, list, nonNull, intArg } from 'nexus';

export const Exchange = objectType({
  name: 'Exchange',
  description: 'This represents an exchange and its information.',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('lastPrice');
  },
});

export const ExchangeQuery = queryField('exchanges', {
  // this looks funky
  type: nonNull(list(nonNull(Exchange))),
  args: {
    id: nonNull(intArg()),
  },
  resolve: (_root, _args, ctx) => {
    return ctx.db.exchanges.filter((e) => _args.id === e.id);
  },
});
