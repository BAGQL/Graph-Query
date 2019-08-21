'use strict';

const { ApolloServer, gql } = require('apollo-server');


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

// Type declaration (in GQL lingo)

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolver Function 
const resolvers = {
  Query: {
    books: () => books,
  },
};

// Instantiation
const server = new ApolloServer({ typeDefs, resolvers });

// Call the listen method on the instantiation of our server
server.listen().then(({ url }) => {
  console.log(`GraphQL API server ready at ${url}`);
});



