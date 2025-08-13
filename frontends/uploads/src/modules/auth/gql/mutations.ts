import { gql } from '@apollo/client';

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
