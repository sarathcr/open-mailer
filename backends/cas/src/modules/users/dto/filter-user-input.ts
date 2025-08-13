import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class FilterUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  hasDeleted?: boolean;
}
