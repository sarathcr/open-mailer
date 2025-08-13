import { ObjectType, Field, ID } from '@nestjs/graphql';
import { History } from 'src/modules/history/entities/history.entity';

@ObjectType()
export class UserEntity {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  employeeId: string;

  @Field()
  isActive: boolean;

  @Field()
  isAdmin: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field(() => [History], { nullable: true })
  histories?: History[];
}
