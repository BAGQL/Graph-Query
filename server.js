'use strict';

const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');
const { find, filter } = require('lodash');

// Dummy data 
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// Type declaration (in gql lingo)

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.

  type Book {
    id: ID
    title: String
    author: String
    posts: [Post!]!
  }

  type Post {
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

// Root Resolver Function 

const baseURL = `https://www.googleapis.com/books/v1/volumes?q=+intitle:`;


const resolvers = {
  Query: {
    books: () => {
      return fetch(`${baseURL}/books`).then(res => res.json()).then((res) => { return res.rows; });
    },
    book: (parent, args) => {
      const { id } = args;
      return fetch(`${baseURL}/books/${id}`).then(res => res.json());
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
    
//     books,
//   },
// };

// Instantiation of our server
const server = new ApolloServer({ typeDefs, resolvers });

// Call the listen method on the instantiation of our server
server.listen().then(({ url }) => {
  console.log(`GraphQL API server ready at ${url}`);
});



