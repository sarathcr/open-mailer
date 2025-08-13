import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateEmailTemplateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  filePath?: string;
}
