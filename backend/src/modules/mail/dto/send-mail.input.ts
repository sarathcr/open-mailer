import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsArray,
  IsBoolean,
  ArrayNotEmpty,
} from 'class-validator';

@InputType()
export class SendMailInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  heading: string;

  @Field(() => [MailBodyItemInput])
  body: MailBodyItemInput[]; // Dynamic array of content items

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  attachmentUrl?: string; // Optional field for attachments
}

@InputType()
export class SendMailRequestInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  smtpConfigId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  emailTemplateId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  from?: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  recipients: string[]; // Email recipients

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsEmail({}, { each: true })
  cc?: string[]; // CC recipients

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsEmail({}, { each: true })
  bcc?: string[]; // BCC recipients

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  sendSeparately?: boolean;

  @Field(() => SendMailInput) // Reference to the SendMailInput DTO
  data: SendMailInput;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  apiTokenId?: string;
}

@InputType()
export class MailBodyItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  type: 'text' | 'button' | 'buttons'; // Type of content (text, button, buttons)

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  text?: string; // Content for text type

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  textAlign?: 'left' | 'center' | 'right'; // Text alignment for text content

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  buttonText?: string; // Text for button

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  buttonLink?: string; // Link for button

  @Field(() => [MailButtonInput], { nullable: true })
  @IsOptional()
  buttons?: MailButtonInput[]; // Array of buttons for 'buttons' type

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  align?: 'left' | 'center' | 'right'; // Alignment for buttons or button group
}

@InputType()
export class MailButtonInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  text: string; // Button text

  @Field()
  @IsString()
  @IsNotEmpty()
  link: string; // Button link
}
