import { InputType, Field } from '@nestjs/graphql';
import { StatusEnum } from '../entities/status.entity';

@InputType()
export class StatuSFilterInput {
  @Field(() => StatusEnum, { nullable: true })
  status?: StatusEnum;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}
