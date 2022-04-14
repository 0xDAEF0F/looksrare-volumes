import { extendType, nonNull, objectType, scalarType } from 'nexus';

export const HelloType = scalarType({
  name: 'Hello',
  description: 'A simple hello world type',
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('hello', {
      type: nonNull(HelloType),
      resolve: () => 'Hello World!',
    });
  },
});
