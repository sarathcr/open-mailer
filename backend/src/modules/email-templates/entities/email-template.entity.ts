import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailTemplate {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  filePath?: string; // Optional file path for email template file

  @Field({ nullable: true })
  primaryImageUrl?: string; // URL for the first logo image

  @Field({ nullable: true })
  primaryLinkUrl?: string; // Link URL for the first logo

  @Field({ nullable: true })
  primaryBg?: string;

  @Field({ nullable: true })
  primaryColor?: string;

  @Field({ nullable: true })
  secondaryImageUrl?: string; // URL for the second logo image

  @Field({ nullable: true })
  secondaryLinkUrl?: string; // Link URL for the second logo

  @Field({ nullable: true })
  secondaryBg?: string; // Link URL for the second logo

  @Field({ nullable: true })
  footerContent?: string; // Optional footer content for the email template

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
