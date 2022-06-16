import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './graphql'

export const schema = makeSchema({
  types: types,
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
  contextType:
    process.env.NODE_ENV === 'development'
      ? {
          module: join(__dirname, './context.ts'),
          alias: 'contextModule',
          export: 'Context',
        }
      : undefined,
})
