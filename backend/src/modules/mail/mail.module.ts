import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiTokenModule } from '../api-token/api-token.module';
import { AuthModule } from '../auth/auth.module';
import { EmailTemplatesModule } from '../email-templates/email-templates.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SmtpConfigsModule } from '../smtp-configs/smtp-configs.module';
import { StatusModule } from '../status/status.module';
import { MailResolver } from './mail.resolver';
import { MailService } from './mail.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    SmtpConfigsModule,
    EmailTemplatesModule,
    ApiTokenModule,
    StatusModule,
    // TBD in progress
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL], // Replace with your RabbitMQ URL
          queue: 'mail_queue2', // Ensure the queue name matches
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [MailService, MailResolver],
  exports: [MailService],
})
export class MailModule {}
