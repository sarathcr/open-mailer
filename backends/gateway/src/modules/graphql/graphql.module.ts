import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module, UnauthorizedException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CasClientModule } from '../cas-client/cas-client.module';
import { CasClientService } from '../cas-client/cas-client.service';
import { generateJwtToken } from '../utils/jwt.utils';
import { formatError } from './format.error';
import { skippedResolvers } from './skippedResolvers';

@Module({
  imports: [
    CasClientModule,
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [CasClientModule],
      useFactory: (casClientService: CasClientService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'cas', url: process.env.CAS_BACKEND_URL },
              { name: 'mailer', url: process.env.MAILER_BACKEND_URL },
            ],
            introspectionHeaders: async () => ({
              'Content-Type': 'application/json',
              'x-apollo-operation-name': 'gateway-introspection',
            }),
          }),
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest: (args) => forwardHeaders(args),
              didReceiveResponse: (args) => handleSetCookieHeader(args),
            });
          },
        },
        server: {
          context: async ({ req, res }) =>
            createServerContext(req, casClientService, res),
          formatError,
          cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
          },
        },
      }),
      inject: [CasClientService],
    }),
  ],
})
export class GraphqlModule {}

/**
 * Forwards headers from the context to the request.
 */
function forwardHeaders({ request, context }) {
  if (context?.headers) {
    Object.entries(context.headers).forEach(([key, value]) => {
      request.http.headers.set(key, value.toString());
    });
  }
}

/**
 * Handles the 'Set-Cookie' header from the microservice response and forwards it.
 */
function handleSetCookieHeader({ response, context }) {
  const setCookieHeader = response.http?.headers.get('Set-Cookie');
  if (setCookieHeader) {
    const cookiesArray = setCookieHeader.split(/,(?=\s*\w+=)/);
    context.res.setHeader('Set-Cookie', cookiesArray);
  }
  return response;
}

/**
 * Creates the server context by passing headers and optionally validating tokens.
 * Skips token validation for specific resolvers.
 */
async function createServerContext(
  req: any,
  casClientService: CasClientService,
  res: any,
) {
  const headers: Record<string, string | undefined> = req.headers;
  const operationName = req.body?.operationName;

  if (!operationName || skippedResolvers.includes(operationName)) {
    console.warn(
      'Operation Name not found. Proceeding without user validation.',
    );
    return { headers, res };
  }

  const accessToken = req.cookies?.access_token;
  if (!accessToken) {
    console.warn('Access token not found. Proceeding without user validation.');
    return { headers, res };
  }

  try {
    const tokenValidationResponse = await casClientService.validateToken({
      req,
    });
    const { casId, isAdmin, firstName, lastName, email } =
      tokenValidationResponse.user;
    const jwtToken = generateJwtToken({
      casId,
      isAdmin,
      firstName,
      lastName,
      email,
    });
    headers['x-user'] = JSON.stringify(jwtToken);
    return { headers, res };
  } catch (error) {
    throw new UnauthorizedException(`Authentication error: ${error.message}`);
  }
}
