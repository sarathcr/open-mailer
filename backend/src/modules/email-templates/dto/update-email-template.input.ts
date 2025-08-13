import { IsOptional, IsString } from 'class-validator';
import { CreateEmailTemplateInput } from './create-email-template.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmailTemplateInput extends PartialType(
  CreateEmailTemplateInput,
) {
  // @Field()
  // @IsString()
  // @IsNotEmpty()
  // id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  subject?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  filePath?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  primaryImageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  primaryBg?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  primaryLinkUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secondaryImageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secondaryBg?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secondaryLinkUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  footerContent?: string;
}
