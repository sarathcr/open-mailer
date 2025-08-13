import { GraphQLFormattedError } from 'graphql';

export interface CustomGraphQLError extends GraphQLFormattedError {
  statusCode?: number;
  error?: string;
  path?: (string | number)[];
  field?: 'email' | 'password';
}
