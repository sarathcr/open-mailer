import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class UserType {
  @Field()
  casId: string;

  @Field()
  isAdmin: boolean;

  @Field()
  firstName: string;

  @Field()
  lastName: boolean;

  @Field()
  email: boolean;
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
