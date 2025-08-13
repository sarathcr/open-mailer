import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { KongJwtGuard } from '../auth/guard/kong-jwt.guard';
import { KeycloakAccessToken } from '../auth/kong-claims';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { PaginationInput } from '../common/dto/pagination.input';
import { SortInput } from '../common/dto/sort.input';
import { CreateSmtpConfigInput } from './dto/create-smtp-config.input';
import { FilterSmtpConfigInput } from './dto/filter-smtp-config.input';
import { SmtpConfigPaginationOutput } from './dto/smtp-config-pagination.output';
import { UpdateSmtpConfigInput } from './dto/update-smtp-config.input';
import { SmtpConfigEntity } from './entities/smtp-config.entity';
import { SmtpConfigsService } from './smtp-configs.service';

@Resolver(() => SmtpConfigEntity)
@UseGuards(KongJwtGuard, RolesGuard)
export class SmtpConfigsResolver {
  constructor(private readonly smtpConfigsService: SmtpConfigsService) {}

  @Mutation(() => SmtpConfigEntity)
  createSmtp(
    @Args('createSmtpConfigInput') createSmtpConfigInput: CreateSmtpConfigInput,
  ) {
    return this.smtpConfigsService.create(createSmtpConfigInput);
  }

  @Query(() => SmtpConfigPaginationOutput) // Modify the return type to Object to match the table data structure
  async findAllSmtp(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filter', { nullable: true }) filter?: FilterSmtpConfigInput,
    @Args('sort', { nullable: true }) sort?: SortInput,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    const result = await this.smtpConfigsService.findAll(
      pagination,
      filter,
      sort,
      search,
    );
    return result;
  }

  @Query(() => String, { nullable: true })
  whoAmI(@CurrentUser() user?: KeycloakAccessToken | null) {
    // If you prefer 401 on missing auth, throw here instead of returning null:
    if (!user) throw new UnauthorizedException('No user in context');

    return user?.name ?? user?.preferred_username ?? null;
  }

  @Query(() => SmtpConfigEntity)
  findOneSmtp(@Args('id') id: string) {
    return this.smtpConfigsService.findOne(id);
  }

  @Mutation(() => SmtpConfigEntity)
  async updateSmtp(
    @Args('id') id: string,
    @Args('updateSmtpConfigInput') updateSmtpConfigInput: UpdateSmtpConfigInput,
  ) {
    return this.smtpConfigsService.update(id, updateSmtpConfigInput);
  }

  @Mutation(() => SmtpConfigEntity)
  removeSmtp(@Args('id') id: string) {
    return this.smtpConfigsService.remove(id);
  }
  @Mutation(() => SmtpConfigEntity)
  softdeleteSmtp(@Args('id') id: string) {
    return this.smtpConfigsService.softdeleteSmtp(id);
  }
  @Mutation(() => SmtpConfigEntity)
  async restoreSmtp(@Args('id', { type: () => String }) id: string) {
    return await this.smtpConfigsService.restoreSmtp(id);
  }
}

// sample payload

// mutation {
//   createSmtp(
//     createSmtpConfigInput: {
//       username: "openmailerpro@gmail.com"
//       password: "rzqn imtn jnvh tiss"
//       secure: false
//       from: "SMTP test from"
//     }
//   ) {
//     id
//     host
//     port
//     username
//     password
//     from
//     secure
//     createdAt
//     updatedAt
//     deletedAt
//   }
// }
