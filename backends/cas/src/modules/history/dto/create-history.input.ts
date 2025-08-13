import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChangeType, EntityType } from '../types';

@InputType()
export class CreateHistoryInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  entityId: string;

  @IsNotEmpty()
  @Field(() => EntityType)
  entityType: EntityType;

  @Field(() => [CreateChangeInput])
  changes: CreateChangeInput[];

  @IsNotEmpty()
  @Field(() => ChangeType)
  changeType: ChangeType;

  @IsNotEmpty()
  @IsString()
  @Field()
  changedBy: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  changedByName: string;
}

@InputType()
export class CreateChangeInput {
  @Field()
  fieldName: string;

  @Field({ nullable: true })
  oldValue?: string;

  @Field({ nullable: true })
  newValue?: string;
}
