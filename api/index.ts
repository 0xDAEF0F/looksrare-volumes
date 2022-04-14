import { schema } from './schema';

// Web server
import express from 'express';
// Firebase
import admin from 'firebase-admin';
import serviceAcct from '../serviceAccount.json';
// GraphQL
import { graphqlHTTP } from 'express-graphql';

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
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/graphql');
});
