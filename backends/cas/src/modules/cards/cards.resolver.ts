import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { AdminGuard } from '../common/guard/admin.guard';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guard/auth.guard';

@Resolver(() => Card)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Mutation(() => Card)
  @UseGuards(AdminGuard)
  createCard(@Args('createCardInput') createCardInput: CreateCardInput) {
    return this.cardsService.create(createCardInput);
  }

  @Query(() => [Card], { name: 'cards' })
  @UseGuards(AuthGuard)
  findAll() {
    return this.cardsService.findAll();
  }

  @Query(() => Card, { name: 'card' })
  @UseGuards(AuthGuard)
  findOne(@Args('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Mutation(() => Card)
  @UseGuards(AdminGuard)
  updateCard(@Args('updateCardInput') updateCardInput: UpdateCardInput) {
    const { id, ...rest } = updateCardInput;
    return this.cardsService.update(id, rest);
  }

  @Mutation(() => Card)
  @UseGuards(AdminGuard)
  removeCard(@Args('id') id: string) {
    return this.cardsService.remove(id);
  }
}
