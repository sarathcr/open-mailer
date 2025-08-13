import { gql } from '@apollo/client';

export const SEND_MAIL_MUTATION = gql`
  mutation sendMail($input: SendMailRequestInput!) {
    sendMail(input: $input)
  }
`;
export const SEND_MAIL_REQUEST_INPUT = gql`
  input SendMailRequestInput {
    smtpConfigId: String!
    emailTemplateId: String!
    recipients: [String!]!
    cc: [String]
    bcc: [String]
    data: MailDataInput!
  }

  input MailDataInput {
    subject: String!
    heading: String
    body: [MailBodyItemInput!]!
  }

  input MailBodyItemInput {
    type: String!
    text: String
    textAlign: String
    buttonText: String
    buttonLink: String
    align: String
    buttons: [MailButtonInput!]
  }

  input MailButtonInput {
    text: String!
    link: String!
  }
`;
