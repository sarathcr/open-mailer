import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { KongJwtGuard } from '../auth/guard/kong-jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PaginationInput } from '../common/dto/pagination.input';
import { CreateStatusInput } from './dto/create-status.input';
import { StatuSFilterInput } from './dto/status-filter.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { MailCount, Status, StatusPagination } from './entities/status.entity';
import { StatusService } from './status.service';

@Resolver(() => Status)
@UseGuards(KongJwtGuard, RolesGuard)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Query(() => StatusPagination, { name: 'statuses' })
  async getStatuses(
    @Args('filterInput', { type: () => StatuSFilterInput, nullable: true })
    filterInput?: StatuSFilterInput,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.statusService.getStatuses(filterInput, pagination, search);
  }

  @Query(() => Status, { name: 'status' })
  async getStatus(@Args('id', { type: () => String }) id: string) {
    return this.statusService.getStatusById(id);
  }

  @Mutation(() => Status)
  async createStatus(@Args('data') data: CreateStatusInput) {
    return this.statusService.createStatus(data);
  }

  @Mutation(() => Status)
  async updateStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateStatusInput,
  ) {
    return this.statusService.updateStatus(id, data);
  }

  @Mutation(() => Status)
  async deleteStatus(@Args('id', { type: () => String }) id: string) {
    return this.statusService.deleteStatus(id);
  }

  @Query(() => MailCount, { name: 'getMailCounts' })
  async getMailCounts() {
    return this.statusService.getMailCounts();
  }
}
