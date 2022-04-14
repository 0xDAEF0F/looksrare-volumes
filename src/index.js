// Web server
const express = require('express');
// Firebase
const admin = require('firebase-admin');
const serviceAcct = require('../service-acct.json');
// GraphQL
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./graphql/types');
const resolvers = require('./graphql/resolvers');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAcct),
});

// GraphQL Endpoint MW
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: true,
  })
);

// Start the server
app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/graphql');
});
