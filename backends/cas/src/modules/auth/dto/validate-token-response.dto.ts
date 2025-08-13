import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class UserType {
  @Field()
  casId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  isAdmin: boolean;
}

@ObjectType()
export class ValidateTokenResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(() => UserType, { nullable: true })
  user?: UserType;
}
