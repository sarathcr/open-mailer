import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  url: string;
}
