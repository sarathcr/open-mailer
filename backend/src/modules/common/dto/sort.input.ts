import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

@InputType()
export class SortInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
