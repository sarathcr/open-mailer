import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Card {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  url: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
