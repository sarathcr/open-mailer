import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInput {
  @Field()
  id: string;

  @Field()
  isAdmin: boolean;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}
