import { Field, ObjectType } from '@nestjs/graphql';
import { SmtpConfigEntity } from '../entities/smtp-config.entity';
import { PaginationEntity } from 'src/modules/common/entities/pagination.entity';

@ObjectType()
export class SmtpConfigPaginationOutput extends PaginationEntity<SmtpConfigEntity> {
  @Field(() => [SmtpConfigEntity])
  data: SmtpConfigEntity[];
}
