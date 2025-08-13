import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt, IsBoolean } from 'class-validator';

@InputType()
export class CreateSmtpConfigInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  host: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  port: number;

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
}
