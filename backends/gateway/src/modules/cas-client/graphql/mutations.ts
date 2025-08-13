import { gql } from '@apollo/client';

export const VALIDATE_TOKEN_MUTATION = gql`
  mutation ValidateToken {
    validateToken {
      message
      success
      user {
        casId
        isAdmin
        firstName
        lastName
        email
      }
    }
  }
`;
