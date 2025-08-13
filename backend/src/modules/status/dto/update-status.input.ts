import { StatusEnum } from '../entities/status.entity';
import { CreateStatusInput } from './create-status.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusInput extends PartialType(CreateStatusInput) {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => StatusEnum, { nullable: true })
  status?: StatusEnum;
}
