import { gql } from '@apollo/client';

export const RETRY_FAILED_EMAIL_MUTATION = gql`
  mutation RetryFailedEmail($id: String!, $smtpConfigId: String!) {
    retryFailedEmail(id: $id, smtpConfigId: $smtpConfigId) {
      status
      message
    }
  }
`;

export const RETRY_ALL_EMAILS = gql`
  mutation RetryFailedEmails {
    retryFailedEmails {
      totalMails
      successMails
      failedMails
    }
  }
`;
