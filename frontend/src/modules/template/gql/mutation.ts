import { gql } from '@apollo/client';

export const CREATE_TEMPLATE_MUTATION = gql`
  mutation CreateEmailTemplate(
    $createEmailTemplateInput: CreateEmailTemplateInput!
  ) {
    createEmailTemplate(createEmailTemplateInput: $createEmailTemplateInput) {
      id
    }
  }
`;

export const SOFT_DELETE_TEMPLATE_MUTATION = gql`
  mutation SoftDeleteTemplate($id: String!) {
    softDeleteTemplate(id: $id) {
      id
    }
  }
`;

export const RESTORE_TEMPLATE_MUTATION = gql`
  mutation RestoreTemplate($id: String!) {
    restoreTemplate(id: $id) {
      id
    }
  }
`;
export const REMOVE_TEMPLATE_MUTATION = gql`
  mutation RemoveEmailTemplate($id: String!) {
    removeEmailTemplate(id: $id) {
      id
    }
  }
`;
