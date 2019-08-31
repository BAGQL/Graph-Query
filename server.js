'use strict';

/** NODE PACKAGES
 * Apollo-Cache-Inmemory
 * Apollo-Link-REST
 * Apollo-Server
 * Express
 * Express-GraphQL
 * Node-Fetch
 * Dotenv
*/
const { InMemoryCache } = require('apollo-cache-inmemory');
const { RestLink } = require('apollo-link-rest');
const { ApolloServer, gql } = require('apollo-server');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const fetch = require('node-fetch');
const app = express();
global.fetch = fetch;
global.Headers = fetch.Headers;
require('dotenv').config();

/** Type declaration (in gql lingo) */
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  # This "Book" type can be used in other type declarations.

  type Book {
    id: ID
    etag: ID
    volumeInfo: VolumeInfo!
    posts: Post!
  }

  type VolumeInfo {
    title: String
    authors: [String]
    description: String
  }

  type Post {
    title: String
    author: String
    description: String
    image_link: String
    ISBN: ID
  }

  # The "Query" type is the root of all GraphQL queries.

  type Query {
    books: [Book!]!
    book(title: String!): Book
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createBook(title: String): Book!
    updateBook(title: String, author: String): Book!
    deleteBook(title: String): Book!
  }
`;

/** RestLink */
const restLink = new RestLink({
  uri: 'https://www.googleapis.com/books/v1/volumes?q=+intitle:',
});

/** Root Resolver Function */
const resolvers = {
  Query: {
    books: () => {
      let terminalInput = '{ books { _id title author description} }';
      return fetch(`${process.env.DATABASEURL}` + terminalInput).then(res => res.json()).then((res) => {
        console.log('We are successfully retrieving data');
        console.log('3', res.data.books);
        return res.books;
      });
    },
    book: (parent, args) => {
      const { id } = args;
      return fetch('https://www.googleapis.com/books/v1/volumes?q=+intitle:').then(res => res.json());
    },
    posts: () => {
      return fetch(`${baseURL}/posts`).then(res => res.json());
    },
    post: (parent, args) => {
      const { id } = args;
      return fetch(`${baseURL}/blog/posts/${id}`).then(res => res.json());
    },
  },
};
    
/** Instantiation of our server */
const server = new ApolloServer({
  apiKey: process.env.ENGINE_API_KEY,
  typeDefs,
  resolvers,
  link: restLink,
  cache: new InMemoryCache});

/** declaration of our use route*/
app.use(
  '/graphql',
  graphqlHTTP({
    schema: typeDefs,
    rootValue: resolvers,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

/** declaration*/
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

/** Call the listen method on the instantiation of our server */
server.listen().then(({ url }) => {
  console.log(`GraphQL API server ready at ${url}`);
});