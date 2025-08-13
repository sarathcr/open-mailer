import { gql } from '@apollo/client';

export const CREATE_API_TOKEN_MUTATION = gql`
  mutation CreateApiToken($createApiTokenInput: CreateApiTokenInput!) {
    createApiToken(createApiTokenInput: $createApiTokenInput) {
      id
      name
      status
      duration
      createdAt
      expireAt
      deletedAt
      token
    }
  }
`;

export const UPDATE_API_TOKEN_MUTATION = gql`
  mutation updateApiToken($updateApiTokenInput: UpdateApiTokenInput!) {
    updateApiToken(updateApiTokenInput: $updateApiTokenInput) {
      id
      name
      status
      duration
      token
    }
  }
`;

export const REMOVE_API_TOKEN_MUTATION = gql`
  mutation removeApiToken($id: String!) {
    removeApiToken(id: $id) {
      id
    }
  }
`;
export const SOFT_DELETE_API_TOKEN_MUTATION = gql`
  mutation softDeleteApiToken($id: String!) {
    softDeleteApiToken(id: $id) {
      id
    }
  }
`;

export const RESTORE_API_TOKEN_MUTATION = gql`
  mutation restoreApiToken($id: String!) {
    restoreApiToken(id: $id) {
      id
    }
  }
`;
