import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiTokenStatus } from './update-api-token.input';

@InputType()
export class FilterApiTokenInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: ApiTokenStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isExpired?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
