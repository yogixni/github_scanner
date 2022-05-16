const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {schema} = require('./graphql/schema');
const {root} = require('./graphql/resolver');

const { PORT } = require('./config/key');

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(PORT, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});