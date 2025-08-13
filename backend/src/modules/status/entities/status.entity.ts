import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { PaginationEntity } from 'src/modules/common/entities/pagination.entity';

export enum StatusEnum {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

registerEnumType(StatusEnum, {
  name: 'StatusEnum',
  description: 'Possible status values for the email processing',
});

@ObjectType()
class ApiTokenLimited {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
class EmailTemplateLimited {
  @Field()
  id: string;

  @Field()
  name: string;
}

@ObjectType()
class SmtpConfigLimited {
  @Field()
  id: string;

  @Field()
  from: string;
}

@ObjectType()
export class Status {
  @Field(() => String)
  id: string;

  @Field(() => String)
  smtpConfigId: string;

  @Field(() => SmtpConfigLimited, { nullable: true })
  smtpConfig?: SmtpConfigLimited;

  @Field(() => String)
  emailTemplateId: string;

  @Field(() => EmailTemplateLimited, { nullable: true })
  emailTemplate?: EmailTemplateLimited;

  @Field(() => String)
  apiTokenId: string;

  @Field(() => ApiTokenLimited, { nullable: true })
  apiToken?: ApiTokenLimited;

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

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}

@ObjectType()
export class StatusPagination extends PaginationEntity<Status> {
  @Field(() => [Status])
  data: Status[];
}

@ObjectType()
export class MailCount {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  pending: number;

  @Field(() => Int)
  failed: number;

  @Field(() => Int)
  success: number;
}
