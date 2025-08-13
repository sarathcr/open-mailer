import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field()
  page: number;

  @Field()
  limit: number;
}
