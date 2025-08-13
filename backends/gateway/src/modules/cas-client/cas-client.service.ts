import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { VALIDATE_TOKEN_MUTATION } from './graphql/mutations';
import { ValidateTokenResponse } from './dto/validate-token-response.dto';

@Injectable()
export class CasClientService {
  private readonly apolloClient: ApolloClient<any>;

  constructor() {
    this.apolloClient = new ApolloClient({
      uri: process.env.CAS_BACKEND_URL,
      cache: new InMemoryCache(),
    });
  }

  /**
   * Validate token for authentication.
   * Calls the `validateToken` mutation on the CAS microservice.
   */
  async validateToken(context: { req: any }): Promise<ValidateTokenResponse> {
    const cookies = context.req.headers.cookie;
    const accessToken = context.req.cookies?.access_token;

    if (!accessToken) {
      throw new UnauthorizedException('No cookies found in the request');
    }

    try {
      const { data } = await this.apolloClient.mutate({
        mutation: gql`
          ${VALIDATE_TOKEN_MUTATION}
        `,
        context: {
          headers: {
            cookie: cookies, // Forward cookies to the CAS microservice
          },
        },
      });

      // Extract response data
      const response: ValidateTokenResponse = data?.validateToken;

      if (!response || !response.success) {
        throw new UnauthorizedException('Token validation failed');
      }

      return response;
    } catch (error) {
      throw new UnauthorizedException(
        `Error validating token via CAS: ${error.message || error}`,
      );
    }
  }
}
