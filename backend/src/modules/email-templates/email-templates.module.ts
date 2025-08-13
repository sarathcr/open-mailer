import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EmailTemplateResolver } from './email-templates.resolver';
import { EmailTemplateService } from './email-templates.service';

@Module({
  imports: [AuthModule],
  providers: [EmailTemplateResolver, EmailTemplateService],
  exports: [EmailTemplateService],
})
export class EmailTemplatesModule {}
