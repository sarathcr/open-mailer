import { Provider } from '@nestjs/common';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export const APOLLO_CLIENT = 'APOLLO_CLIENT';

export const ApolloClientProvider: Provider = {
  provide: APOLLO_CLIENT,
  useFactory: () => {
    const httpLink = new HttpLink({
      uri: process.env.GATEWAY_BACKEND_URL,
    });

    const authLink = setContext(() => ({
      headers: {
        Authorization: `Bearer ${process.env.MAILER_API_TOKEN}`,
      },
    }));

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  },
};
