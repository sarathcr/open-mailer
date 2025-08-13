import { GraphQLError, GraphQLFormattedError } from 'graphql';

interface CustomGraphQLError extends GraphQLFormattedError {
  statusCode?: number;
  error?: string;
  path?: (string | number)[];
  field?: string;
}

export const formatError = (error: GraphQLError): CustomGraphQLError => {
  const originalError = (error.extensions?.exception ||
    error.extensions?.originalError ||
    {}) as Partial<CustomGraphQLError>;

  const statusCode =
    typeof originalError?.statusCode === 'number'
      ? originalError?.statusCode
      : typeof error.extensions?.statusCode === 'number'
        ? error.extensions?.statusCode
        : 500;

  const errorMessage =
    typeof originalError?.error === 'string'
      ? originalError?.error
      : typeof error.extensions?.error === 'string'
        ? error.extensions?.error
        : 'Internal Server Error';

  const field =
    typeof originalError?.field === 'string'
      ? originalError?.field
      : typeof error.extensions?.field === 'string'
        ? error.extensions?.field
        : undefined;

  return {
    message: error.message,
    statusCode,
    error: errorMessage,
    path: error.path as (string | number)[],
    field,
  };
};
