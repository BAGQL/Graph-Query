'use strict';

const { ApolloServer, gql } = require('apollo-server');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { RestLink } = require('apollo-link-rest');
const fetch = require('node-fetch').default;
global.fetch = fetch;
global.Headers = fetch.Headers;


const server = new ApolloServer({
  cache: new InMemoryCache(),
  link: new RestLink({
    uri: 'http://localhost:4000',
  }),
  fetch: fetch,
});

describe('Hello World Server', () => {
  it('Can return Hello World!', () => {

  });


  it('Should get books', async () => {
    const getBooks = gql`
            query {
                books {
                    id
                    title
                    authors
                }
            }
        `;
    const response = await server.query({ query: getBooks });
    expect(response.data.books[0].title).toBe('Apples');
  });
});