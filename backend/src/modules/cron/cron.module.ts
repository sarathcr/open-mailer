import { Module } from '@nestjs/common';
import { MailCronService } from './mail-cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ScheduleModule.forRoot(), MailModule],
  providers: [MailCronService],
})
export class CronModule {}
