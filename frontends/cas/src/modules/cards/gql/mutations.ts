import { gql } from '@apollo/client';

export const CREATE_CARD_MUTATION = gql`
  mutation CreateCard($createCardInput: CreateCardInput!) {
    createCard(createCardInput: $createCardInput) {
      id
    }
  }
`;

export const UPDATE_CARD_MUTATION = gql`
  mutation UpdateCard($updateCardInput: UpdateCardInput!) {
    updateCard(updateCardInput: $updateCardInput) {
      id
    }
  }
`;

export const REMOVE_CARD_MUTATION = gql`
  mutation RemoveCard($id: String!) {
    removeCard(id: $id) {
      id
    }
  }
`;
