import { Module } from '@nestjs/common';
import { MailClientService } from './mail-client.service';
import { ApolloClientProvider } from './apollo-client.provider';

@Module({
  providers: [MailClientService, ApolloClientProvider],
  exports: [MailClientService, ApolloClientProvider],
})
export class OpenClientModule {}
