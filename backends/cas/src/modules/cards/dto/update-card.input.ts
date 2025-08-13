import { CreateCardInput } from './create-card.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCardInput extends PartialType(CreateCardInput) {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  url?: string;
}
