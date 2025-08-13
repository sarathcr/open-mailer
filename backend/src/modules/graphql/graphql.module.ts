import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { formatError } from './format.error';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError,
    }),
  ],
})
export class GraphqlModule {}
