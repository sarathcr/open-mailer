import { Module } from '@nestjs/common';
import { CasClientService } from './cas-client.service';

@Module({
  providers: [CasClientService],
  exports: [CasClientService],
})
export class CasClientModule {}
