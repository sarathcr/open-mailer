import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SmtpConfigsResolver } from './smtp-configs.resolver';
import { SmtpConfigsService } from './smtp-configs.service';

@Module({
  imports: [AuthModule],
  providers: [SmtpConfigsResolver, SmtpConfigsService],
  exports: [SmtpConfigsService],
})
export class SmtpConfigsModule {}
