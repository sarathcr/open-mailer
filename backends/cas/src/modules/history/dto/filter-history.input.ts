import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterHistoryInput {
  @Field({ nullable: true })
  entityId?: string;

  @Field({ nullable: true })
  changedBy?: string;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;
}
