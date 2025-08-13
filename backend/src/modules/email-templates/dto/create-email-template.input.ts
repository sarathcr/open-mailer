import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateEmailTemplateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

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
