import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { CreateSmtpConfigInput } from './create-smtp-config.input';

@InputType()
export class UpdateSmtpConfigInput extends PartialType(CreateSmtpConfigInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  host?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  port?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  secure?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  from?: string; // from name

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isBackUp: boolean;
}
