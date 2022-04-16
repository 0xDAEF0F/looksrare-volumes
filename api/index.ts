// Web server
import express from 'express';
// Firebase
import admin from 'firebase-admin';
import serviceAcct from '../serviceAccount.json';
// GraphQL
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema';
import { context } from './context';

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAcct as admin.ServiceAccount),
});

// GraphQL Endpoint MW
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: context,
  })
);

app.get('/', (_, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/graphql');
});
