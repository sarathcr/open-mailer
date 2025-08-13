import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RetryMailsEntity {
  @Field(() => Int)
  totalMails: number;

  @Field(() => Int)
  successMails: number;

  @Field(() => Int)
  failedMails: number;
}

@ObjectType()
export class RetryMailEntity {
  @Field()
  status: string;

  @Field()
  message: string;
}
