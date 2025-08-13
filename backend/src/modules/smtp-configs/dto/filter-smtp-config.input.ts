import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

@InputType()
export class FilterSmtpConfigInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasDeleted?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  createdAt?: Date; // Filter by creation date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  updatedAt?: Date; // Filter by last update date

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isBackUp?: boolean;
}
