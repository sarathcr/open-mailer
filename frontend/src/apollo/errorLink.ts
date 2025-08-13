/* eslint-disable no-unused-vars */
import keycloak from '@/auth/keycloak';
import { Toast } from '@/hooks/use-toast';
import { ApolloClient, FetchResult } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { useRouter } from 'next/navigation';

export const createErrorLink = (
  toast: (props: Toast) => void,
  clientRef: { current: ApolloClient<any> | null },
  router: ReturnType<typeof useRouter>
) => {
  let refreshingToken = false;
  let failedQueue: Array<{
    resolve: (result: FetchResult) => void;
    reject: (reason?: any) => void;
  }> = [];

  const processQueue = (error: any) => {
    failedQueue.forEach(({ reject }) => reject(error));
    failedQueue = [];
  };

  const bypassTokenRefreshOperations = new Set([
    'Login',
    'RefreshToken',
    'ForgotPassword', // remove if not needed
  ]);

  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      const statusCode = (networkError as any)?.status;
      const message = (networkError as any)?.message;
      const error =
        (networkError as any)?.bodyText || (networkError as any)?.error;
      const path = (networkError as any)?.path;

      const errorTitleMap: Record<number | string, string> = {
        400: 'Bad Request',
        401: 'Authentication Failed',
        403: 'Access Denied',
        404: 'Resource Not Found',
        500: 'Server Error',
      };

      const title = errorTitleMap[statusCode || ''] || 'An Error Occurred';
      let description = message || '';

      if (error) description += ` | Error: ${error}`;
      if (path) description += ` | Path: ${path.join(' > ')}`;

      if (statusCode === 401) {
        keycloak.logout();
      } else {
        toast({
          title,
          description,
          variant: 'destructive',
          duration: 6000,
        });
      }
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, extensions, path }) => {
        toast({
          title: 'GraphQL Error',
          description: `${message}${path ? ` | Path: ${path.join(' > ')}` : ''}`,
          variant: 'destructive',
        });
      });
    }
  });
};
