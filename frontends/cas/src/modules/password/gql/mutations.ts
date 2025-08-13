import { gql } from '@apollo/client';

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation GeneratePasswordResetToken($email: String!) {
    generatePasswordResetToken(email: $email) {
      message
      success
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, input: { password: $password }) {
      message
      success
    }
  }
`;
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($password: String!) {
    changePassword(input: { password: $password }) {
      message
      success
    }
  }
`;
