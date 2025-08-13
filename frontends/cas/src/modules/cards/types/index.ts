import { CardFormInputs } from '../schemas';

export interface Card {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardsData {
  cards: Card[];
}

export interface CardFormProps {
  values: CardFormInputs;
  onClickSubmit?: () => void;
}
