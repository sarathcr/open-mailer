import { Inject, Injectable } from '@nestjs/common';
import { ApolloClient, gql } from '@apollo/client/core';
import { APOLLO_CLIENT } from './apollo-client.provider';

@Injectable()
export class MailClientService {
  constructor(
    @Inject(APOLLO_CLIENT) private readonly apolloClient: ApolloClient<any>,
  ) {}

  async sendMail(input: any) {
    const SEND_MAIL_MUTATION = gql`
      mutation SendMail($input: SendMailRequestInput!) {
        sendMail(input: $input)
      }
    `;

    const { data } = await this.apolloClient.mutate({
      mutation: SEND_MAIL_MUTATION,
      variables: { input },
    });

    return data.sendMail;
  }
}
