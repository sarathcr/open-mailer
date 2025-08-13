import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateSmtpConfigInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  host?: string;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  port?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field()
  @IsBoolean()
  secure: boolean;

  @Field()
  @IsNotEmpty()
  @IsString()
  from: string; //from Name

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isBackUp: boolean;
}
