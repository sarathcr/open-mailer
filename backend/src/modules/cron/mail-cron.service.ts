import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MailCronService {
  constructor(private readonly mailService: MailService) {}
  private readonly logger = new Logger(MailCronService.name);

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleFailedStatuses() {
    this.logger.log('Running cron job to process failed statuses...');
    const includeMaxTries = true;
    this.mailService.retryFailedEmails(includeMaxTries);
  }
}
