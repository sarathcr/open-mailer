import { Field, ObjectType } from '@nestjs/graphql';
import { EmailTemplate } from '../entities/email-template.entity';
import { PaginationEntity } from 'src/modules/common/entities/pagination.entity';

@ObjectType()
export class EmailTemplatePaginationOutput extends PaginationEntity<EmailTemplate> {
  @Field(() => [EmailTemplate])
  data: EmailTemplate[];
}
