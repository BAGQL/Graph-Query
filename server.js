'use strict';

/** NODE PACKAGES
 * Apollo-Server
 * Node-Fetch
 * Dotenv
*/

// testing below
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const graphqlHTTP = require('express-graphql');
const app = express();

// testing above


const { ApolloServer, gql } = require('apollo-server');
const { RestLink } = require('apollo-link-rest');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');

const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;

require('dotenv').config();


// Dummy data 
// const books = [
//   {
//     title: 'Harry Potter and the Chamber of Secrets',
//     author: 'J.K. Rowling',
//   },
//   {
//     title: 'Jurassic Park',
//     author: 'Michael Crichton',
//   },
// ];

// Type declaration (in gql lingo)
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
  # (A "Mutation" type will be covered later on.)

  type Query {
    books: [Book!]!
    book(title: String!): Book
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createBook(name: String!): Book!
    updateBook(title: String!, name: String!): Book
    deleteBook(title: String!): Book
  }
`;


// RestLink
const restLink = new RestLink({
  uri: 'https://www.googleapis.com/books/v1/volumes?q=+intitle:',
});

// Root Resolver Function

const baseURL = `https://www.googleapis.com/books/v1/volumes?q=+intitle:`;


const resolvers = {
  Query: {
    books: () => {
      let userInput = process.argv.slice(2);
      // let userSearch = document.getElementsByClassName('submitBox').value;
      return fetch(`${baseURL}` + userInput).then(res => res.json()).then((res) => {
        console.log(res.items);
        return res.items; });

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
    

// Instantiation of our server
const server = new ApolloServer({
  apiKey: process.env.ENGINE_API_KEY,
  typeDefs,
  resolvers,
  link: restLink,
  cache: new InMemoryCache});
  
// Instantiate required constructor fields
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/',
});

const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: link,
  fetch: fetch,
});


// client.post(
//   '/graphql',
//   graphqlHTTP({
//     schema: typeDefs,
//     graphiql: false,
//   }),
// );

client.query({
  query: gql`
    query books {
        id
        etag
        volumeInfo{
          title
          authors
          description
        }
      }
    `,
}).then(result => console.log(result));

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    process.env.MONGODB_URI,  { useNewUrlParser: true }
  )
  .then(result => {
    app.listen(9001);
  })
  .catch(err => console.log(err));

// client.post('/searches', (request, response) => {
//   let userInput = process.argv.slice(2);
//   // let userSearch = document.getElementsByClassName('submitBox').value;
//   fetch(`${baseURL}` + userInput).then(res => res.json()).then((res) => {
  
//     // console.log(result.body);
//     // response.send(result.body.items[0].volumeInfo.title);
//     // response.send(result.body.items);
//     // book_array = new Book_input(result.body.items[0])
//     if(res.body.totalItems === 0){
//       let fail = 'The book you have searched for was not found by the API!';
//       response.render('pages/searches/error.ejs',{fail});
//     } else {
//       let test = res.body.items.map(build_book_display);
//       response.render('pages/searches/show.ejs',{data:test});
//       // code for add to database
//     }
//   })
//     .catch(err => {
//       console.log(err);
//       response.render('pages/searches/APIerror.ejs',{error: err});
//     });
//   // console.log(request.body);
// });

// Call the listen method on the instantiation of our server
server.listen().then(({ url }) => {
  console.log(`GraphQL API server ready at ${url}`);
});