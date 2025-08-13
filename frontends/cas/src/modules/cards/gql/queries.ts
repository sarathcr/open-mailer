import { gql } from '@apollo/client';

export const GET_CARDS_QUERY = gql`
  query GetCards {
    cards {
      id
      title
      description
      url
    }
  }
`;
