import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PaginationEntity<T> {
  @Field()
  totalPages: number;

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;
}
