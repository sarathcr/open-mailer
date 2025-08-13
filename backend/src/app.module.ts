import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiTokenModule } from './modules/api-token/api-token.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { CronModule } from './modules/cron/cron.module';
import { EmailTemplatesModule } from './modules/email-templates/email-templates.module';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { MailModule } from './modules/mail/mail.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SmtpConfigsModule } from './modules/smtp-configs/smtp-configs.module';
import { StatusModule } from './modules/status/status.module';

@Module({
  imports: [
    PrismaModule,
    GraphqlModule,
    SmtpConfigsModule,
    EmailTemplatesModule,
    MailModule,
    AssetsModule,
    ApiTokenModule,
    StatusModule,
    CronModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
