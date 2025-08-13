import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsResolver } from './cards.resolver';

@Module({
  providers: [CardsResolver, CardsService],
})
export class CardsModule {}
