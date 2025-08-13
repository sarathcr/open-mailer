import { InputType, Int, Field } from '@nestjs/graphql';
import { StatusEnum } from '../entities/status.entity';

@InputType()
export class CreateStatusInput {
  @Field(() => String)
  smtpConfigId: string;

  @Field(() => String)
  emailTemplateId: string;

  @Field(() => String)
  apiTokenId: string;

  @Field(() => String)
  recipients: string;

  @Field(() => String, { nullable: true })
  data?: string;

  @Field(() => StatusEnum)
  status: StatusEnum;

  @Field(() => Int)
  retries: number;

  @Field(() => Int)
  maxRetries: number;

  @Field(() => String, { nullable: true })
  errorMessage?: string;
}
