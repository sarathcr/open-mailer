import { gql } from '@apollo/client';

export const UPDATE_EMAIL_TEMPLATE = gql`
  mutation UpdateEmailTemplate(
    $id: String!
    $updateEmailTemplateInput: UpdateEmailTemplateInput!
  ) {
    updateEmailTemplate(
      id: $id
      updateEmailTemplateInput: $updateEmailTemplateInput
    ) {
      id
      name
      updatedAt
      filePath
    }
  }
`;
