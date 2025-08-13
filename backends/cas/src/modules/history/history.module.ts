import { Global, Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryResolver } from './history.resolver';

@Global()
@Module({
  providers: [HistoryResolver, HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
