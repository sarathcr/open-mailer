import { REFRESH_TOKEN_MUTATION } from '@/modules/auth/gql';
import { ApolloClient } from '@apollo/client';

export const refreshTokenMutation = async (
  client: ApolloClient<any> | null
) => {
  if (!client) {
    throw new Error('Apollo Client is not defined');
  }
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
    });

    if (data?.refreshTokens?.success) {
      // No need to manually handle the token since it’s in the cookie
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};
