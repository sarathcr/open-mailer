import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StatusResolver } from './status.resolver';
import { StatusService } from './status.service';

@Module({
  imports: [AuthModule],
  providers: [StatusResolver, StatusService],
  exports: [StatusService],
})
export class StatusModule {}
