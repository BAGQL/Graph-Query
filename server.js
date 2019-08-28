'use strict';

/** NODE PACKAGES
 * Apollo-Server
 * Node-Fetch
 * Dotenv
 * Mongoose
*/

const { ApolloServer, gql } = require('apollo-server');
const { RestLink } = require('apollo-link-rest');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');
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

// Call the listen method on the instantiation of our server
server.listen().then(({ url }) => {
  console.log(`GraphQL API server ready at ${url}`);
});