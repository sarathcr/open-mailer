/* eslint-disable no-unused-vars */
import { Toast } from '@/hooks/use-toast';
import { ApolloClient, FetchResult, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { refreshTokenMutation } from './refreshToken';
import { useRouter } from 'next/navigation';
import { CustomGraphQLError } from './types/common';

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
    const isAuthOperation = bypassTokenRefreshOperations.has(
      operation.operationName
    );
    if (graphQLErrors) {
      for (const {
        message,
        path,
        statusCode,
        error,
      } of graphQLErrors as CustomGraphQLError[]) {
        const errorTitleMap: Record<number | string, string> = {
          400: 'Bad Request',
          401: 'Authentication Failed',
          403: 'Access Denied',
          404: 'Resource Not Found',
          500: 'Server Error',
        };

        const title = errorTitleMap[statusCode || ''] || 'An Error Occurred';
        let description = message;
        if (error) description += ` | Error: ${error}`;
        if (path) description += ` | Path: ${path.join(' > ')}`;

        if (statusCode === 401 && !isAuthOperation) {
          if (!clientRef.current) {
            throw new Error('Apollo Client is not initialized');
          }

          if (refreshingToken) {
            return new Observable<FetchResult>((observer) => {
              failedQueue.push({
                resolve: (result) => observer.next(result),
                reject: (error) => observer.error(error),
              });
            });
          }

          refreshingToken = true;

          return new Observable<FetchResult>((observer) => {
            refreshTokenMutation(clientRef.current)
              .then(() => {
                processQueue(null);
                forward(operation).subscribe({
                  next: (result) => observer.next(result),
                  error: (err) => observer.error(err),
                  complete: () => observer.complete(),
                });
              })
              .catch((error) => {
                processQueue(error);
                toast({
                  title: 'Session expired. Please log in again.',
                  description: 'Please log back in to continue',
                  variant: 'default',
                  duration: 5000,
                });
                router.push('auth/login');
                observer.error(error);
              })
              .finally(() => {
                refreshingToken = false;
              });
          });
        }

        toast({
          title,
          description,
          variant: 'default',
          duration: 5000,
        });
      }
    }

    if (networkError && 'statusCode' in networkError) {
      const statusCode = (networkError as any).statusCode;
      if (statusCode === 401 && !isAuthOperation) {
        if (!clientRef.current) {
          throw new Error('Apollo Client is not initialized');
        }

        if (refreshingToken) {
          return new Observable<FetchResult>((observer) => {
            failedQueue.push({
              resolve: (result) => observer.next(result),
              reject: (error) => observer.error(error),
            });
          });
        }

        refreshingToken = true;

        return new Observable<FetchResult>((observer) => {
          refreshTokenMutation(clientRef.current)
            .then(() => {
              processQueue(null);
              forward(operation).subscribe({
                next: (result) => observer.next(result),
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
              });
            })
            .catch((error) => {
              processQueue(error);
              toast({
                title: 'Session expired. Please log in again.',
                description: 'Please log back in to continue',
                variant: 'default',
                duration: 5000,
              });
              router.push('auth/login');
              observer.error(error);
            })
            .finally(() => {
              refreshingToken = false;
            });
        });
      }
    }
  });
};
