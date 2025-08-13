import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, Matches } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
