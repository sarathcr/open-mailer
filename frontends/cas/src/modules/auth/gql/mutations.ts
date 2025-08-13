import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      success
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
      success
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshTokens {
      message
      success
    }
  }
`;
