'use strict';

const express = require('express');
const graphQL = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hi: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hi: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use('/graphql', graphQL({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


