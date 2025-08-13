import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserInput } from 'src/modules/common/dto/user.input';
import { PaginationEntity } from 'src/modules/common/entities/pagination.entity';

@ObjectType()
export class ApiToken {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => String)
  status: 'ACTIVE' | 'DISABLED' | 'REVOKED';

  @Field(() => Int)
  duration: number;

  @Field(() => UserInput)
  createdBy: UserInput;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  expireAt?: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  token?: string;
}

@ObjectType()
export class ApiTokenPagination extends PaginationEntity<ApiToken> {
  @Field(() => [ApiToken])
  data: ApiToken[];
}

@ObjectType()
export class TokenResponse {
  @Field()
  token: string;
}
