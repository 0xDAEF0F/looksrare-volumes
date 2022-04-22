import { extendType } from 'nexus'

// Sample Test Query
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('hello', {
      type: 'String',
      resolve: () => 'Hello World!',
    })
  },
})
