import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: 'include',
});

export const createApolloClient = (errorLink: any) => {
  return new ApolloClient({
    link: errorLink.concat(httpLink),
    cache: new InMemoryCache({}),
  });
};
