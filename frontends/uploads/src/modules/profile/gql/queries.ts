import { gql } from '@apollo/client';

export const GET_PROFILE_QUERY = gql`
  query GetProfile {
    getProfile {
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
