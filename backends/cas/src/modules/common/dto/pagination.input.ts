import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  @IsOptional()
  @Min(1)
  page?: number;

  @Field({ nullable: true })
  limit: number;
}
