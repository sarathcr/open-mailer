import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class History {
  @Field()
  entityId: string;

  @Field()
  entityType: string;

  @Field(() => [Change])
  changes: Change[];

  @Field()
  changeType: string;

  @Field()
  changedBy: string;

  @Field()
  changedByName: string;

  @Field()
  changedAt: Date;
}

@ObjectType()
export class Change {
  @Field()
  fieldName: string;

  @Field({ nullable: true })
  oldValue?: string;

  @Field({ nullable: true })
  newValue?: string;
}
