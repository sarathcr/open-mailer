import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateApiTokenInput {
  @Field()
  name: string;

  @Field(() => Int)
  duration: number; // Duration in days (0 for unlimited)
}
