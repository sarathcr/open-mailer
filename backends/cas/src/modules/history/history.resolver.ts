import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HistoryService } from './history.service';
import { History } from './entities/history.entity';
import { CreateHistoryInput } from './dto/create-history.input';
import { FilterHistoryInput } from './dto/filter-history.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guard/auth.guard';

@Resolver(() => History)
export class HistoryResolver {
  constructor(private readonly historyService: HistoryService) {}

  @Mutation(() => History)
  @UseGuards(AuthGuard)
  createHistory(
    @Args('createHistoryInput') createHistoryInput: CreateHistoryInput,
  ) {
    return this.historyService.create(createHistoryInput);
  }

  @Query(() => [History], { name: 'history' })
  @UseGuards(AuthGuard)
  getHistory(
    @Args('filter', { type: () => FilterHistoryInput, nullable: true })
    filter: FilterHistoryInput,
  ) {
    return this.historyService.getHistory(filter);
  }
}
