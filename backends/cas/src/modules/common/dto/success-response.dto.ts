import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SuccessResponse {
  @Field()
  message: string;
  @Field()
  success: boolean;
}
