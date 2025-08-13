import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
    }
  }
`;

export const SOFT_DELETE_USER_MUTATION = gql`
  mutation SoftDeleteUser($id: String!) {
    softDeleteUser(id: $id) {
      id
    }
  }
`;
