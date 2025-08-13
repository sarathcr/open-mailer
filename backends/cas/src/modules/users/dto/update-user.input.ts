import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  deletedAt?: Date;
}
