import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      employeeId
      isActive
      isAdmin
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
