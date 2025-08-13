import { GraphQLError, GraphQLFormattedError } from 'graphql';

interface CustomGraphQLError extends GraphQLFormattedError {
  statusCode?: number;
  error?: string;
  path?: (string | number)[];
}

export const formatError = (error: GraphQLError): CustomGraphQLError => {
  const originalError = error.extensions?.originalError as Error & {
    statusCode?: number;
    error?: string;
  };
  const statusCode = originalError?.statusCode || 500;
  const errorMessage = originalError?.error || 'Internal Server Error';
  //   uncomment here for debugging/development
  //   console.log(error);

  return {
    message: error.message,
    statusCode,
    error: errorMessage,
    path: error.path as (string | number)[],
    extensions: {
      statusCode,
      error: errorMessage,
      path: error.path as (string | number)[],
    },
  };
};
