import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SmtpConfigEntity {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  host: string;

  @Field({ nullable: true })
  port: number;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  from: string;

  @Field()
  secure: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field()
  isBackUp: boolean;
}
