import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateApiTokenInput {
  @Field()
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  status?: ApiTokenStatus;

  @Field(() => Int, { nullable: true })
  duration?: number;
}

export enum ApiTokenStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  REVOKED = 'REVOKED',
}
