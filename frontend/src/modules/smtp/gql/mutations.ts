import { gql } from '@apollo/client';

export const CREATE_SMTP_MUTATION = gql`
  mutation CreateSmtp($createSmtpConfigInput: CreateSmtpConfigInput!) {
    createSmtp(createSmtpConfigInput: $createSmtpConfigInput) {
      id
    }
  }
`;

export const UPDATE_SMTP_MUTATION = gql`
  mutation updateSmtp(
    $id: String!
    $updateSmtpConfigInput: UpdateSmtpConfigInput!
  ) {
    updateSmtp(id: $id, updateSmtpConfigInput: $updateSmtpConfigInput) {
      id
    }
  }
`;

export const REMOVE_SMTP_MUTATION = gql`
  mutation removeSmtp($id: String!) {
    removeSmtp(id: $id) {
      id
    }
  }
`;
export const SOFT_DELETE_SMTP_MUTATION = gql`
  mutation softdeleteSmtp($id: String!) {
    softdeleteSmtp(id: $id) {
      id
    }
  }
`;

export const RESTORE_SMTP_MUTATION = gql`
  mutation restoreSmtp($id: String!) {
    restoreSmtp(id: $id) {
      id
    }
  }
`;
