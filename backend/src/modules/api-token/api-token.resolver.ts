import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { KongJwtGuard } from '../auth/guard/kong-jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { PaginationInput } from '../common/dto/pagination.input';
import { UserInput } from '../common/dto/user.input';
import { ApiTokenService } from './api-token.service';
import { CreateApiTokenInput } from './dto/create-api-token.input';
import { FilterApiTokenInput } from './dto/filter-api-token.input';
import { UpdateApiTokenInput } from './dto/update-api-token.input';
import {
  ApiToken,
  ApiTokenPagination,
  TokenResponse,
} from './entities/api-token.entity';

@Resolver(() => ApiToken)
@UseGuards(KongJwtGuard, RolesGuard)
export class ApiTokenResolver {
  constructor(private readonly apiTokenService: ApiTokenService) {}

  @Mutation(() => ApiToken)
  async createApiToken(
    @Args('createApiTokenInput') createApiTokenInput: CreateApiTokenInput,
    @CurrentUser() createdBy: UserInput,
  ) {
    return this.apiTokenService.create(createApiTokenInput, createdBy);
  }

  @Query(() => ApiTokenPagination, { name: 'apiTokens' })
  findAll(
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('filter', { type: () => FilterApiTokenInput, nullable: true })
    filter?: FilterApiTokenInput,
  ) {
    return this.apiTokenService.findAll(pagination, search, filter);
  }

  @Query(() => ApiToken, { name: 'apiToken' })
  findOne(@Args('id') id: string) {
    return this.apiTokenService.findOne(id);
  }

  @Mutation(() => ApiToken)
  updateApiToken(
    @Args('updateApiTokenInput') updateApiTokenInput: UpdateApiTokenInput,
  ) {
    const { id, ...rest } = updateApiTokenInput;
    return this.apiTokenService.update(id, rest);
  }

  @Mutation(() => ApiToken)
  softDeleteApiToken(@Args('id') id: string) {
    return this.apiTokenService.softDelete(id);
  }

  @Mutation(() => ApiToken)
  restoreApiToken(@Args('id') id: string) {
    return this.apiTokenService.restore(id);
  }

  @Mutation(() => ApiToken)
  removeApiToken(@Args('id') id: string) {
    return this.apiTokenService.remove(id);
  }

  @Query(() => TokenResponse, { name: 'regenerateToken' })
  regenerateToken(@Args('id') id: string) {
    return this.apiTokenService.regenerateToken(id);
  }
}
