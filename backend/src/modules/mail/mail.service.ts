import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { EmailTemplateService } from '../email-templates/email-templates.service';
import { SmtpConfigsService } from '../smtp-configs/smtp-configs.service';
import { StatusEnum } from '../status/entities/status.entity';
import { StatusService } from '../status/status.service';
import { SendMailRequestInput } from './dto/send-mail.input';

@Injectable()
export class MailService {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private smtpConfigCache: Map<string, any> = new Map();
  constructor(
    private readonly smtpConfigsService: SmtpConfigsService,
    private readonly templateService: EmailTemplateService,
    private statusService: StatusService,
  ) {
    this.registerHandlebarsHelpers();
  }

  // Register Handlebars helpers globally
  private registerHandlebarsHelpers() {
    Handlebars.registerHelper('eq', (a, b) => a === b);
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    });
  }

  // Resolve the template file path based on the environment
  private getFilePath(fileName: string): string {
    const baseDir = path.resolve(__dirname, '..', '..', 'public', 'templates');
    return path.join(baseDir, fileName);
  }
  // Load and cache email templates
  private async loadAndCacheTemplate(
    templatePath: string,
  ): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templatePath)) {
      return this.templateCache.get(templatePath)!;
    }

    const templateContent = await this.loadTemplateContent(templatePath);
    const compiledTemplate = Handlebars.compile(templateContent);
    this.templateCache.set(templatePath, compiledTemplate);

    return compiledTemplate;
  }

  // Load template content from file or URL
  private async loadTemplateContent(templatePath?: string): Promise<string> {
    try {
      if (!templatePath) {
        const filePath = this.getFilePath('default.html');
        return await fs.promises.readFile(filePath, 'utf8');
      }

      if (fs.existsSync(templatePath)) {
        return await fs.promises.readFile(templatePath, 'utf8');
      }

      const response = await axios.get(templatePath);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to load template from ${templatePath || 'default'}: ${error.message}`,
      );
    }
  }

  // Retrieve and cache SMTP configuration
  private async getCachedSmtpConfig(smtpConfigId: string): Promise<any> {
    if (this.smtpConfigCache.has(smtpConfigId)) {
      return this.smtpConfigCache.get(smtpConfigId)!;
    }

    const config = await this.smtpConfigsService.findOne(smtpConfigId);
    const enrichedConfig = this.smtpConfigsService.applySMTPDefaults(config);
    this.smtpConfigCache.set(smtpConfigId, enrichedConfig);

    return enrichedConfig;
  }

  // Send an email
  async sendMail(
    sendMailRequestInput: SendMailRequestInput,
    addStatus: boolean = true,
  ): Promise<boolean> {
    const {
      smtpConfigId,
      emailTemplateId,
      recipients,
      cc,
      bcc,
      sendSeparately,
      from,
      data,
      apiTokenId,
    } = sendMailRequestInput;

    try {
      // Fetch SMTP config and email template concurrently
      const [smtpConfig, template] = await Promise.all([
        this.getCachedSmtpConfig(smtpConfigId),
        this.templateService.findOne(emailTemplateId),
      ]);

      const transporter = nodemailer.createTransport(smtpConfig);
      const templateCompiler = await this.loadAndCacheTemplate(
        template.filePath,
      );
      const generatedHtml = templateCompiler({ ...data, ...template });

      if (sendSeparately) {
        for (const recipient of recipients) {
          try {
            const mailOptions = this.buildMailOptions(
              from || smtpConfig.from,
              recipient,
              cc,
              bcc,
              data.subject,
              generatedHtml,
            );

            const info = await transporter.sendMail(mailOptions);
            console.log(`Message sent to ${recipient}: %s`, info.messageId);

            addStatus &&
              (await this.statusService.createStatus({
                smtpConfigId,
                emailTemplateId,
                apiTokenId,
                recipients: recipient,
                data: null,
                status: StatusEnum.SUCCESS,
                retries: 0,
                maxRetries: 3,
                errorMessage: null,
              }));
          } catch (error) {
            console.error(`Error sending mail to ${recipient}:`, error.message);

            addStatus &&
              (await this.statusService.createStatus({
                smtpConfigId,
                emailTemplateId,
                apiTokenId,
                recipients: recipient,
                data: JSON.stringify(sendMailRequestInput),
                status: StatusEnum.FAILED,
                retries: 0,
                maxRetries: 3,
                errorMessage: error.message,
              }));
          }
        }
      } else {
        try {
          const mailOptions = this.buildMailOptions(
            from || smtpConfig.from,
            recipients.join(','),
            cc,
            bcc,
            data.subject,
            generatedHtml,
          );

          const info = await transporter.sendMail(mailOptions);
          console.log('Message sent as a group: %s', info.messageId);

          addStatus &&
            (await Promise.all(
              recipients.map((recipient) =>
                this.statusService.createStatus({
                  smtpConfigId,
                  emailTemplateId,
                  apiTokenId,
                  recipients: recipient,
                  data: null,
                  status: StatusEnum.SUCCESS,
                  retries: 0,
                  maxRetries: 3,
                  errorMessage: null,
                }),
              ),
            ));
        } catch (error) {
          console.error('Error sending group mail:', error.message);

          addStatus &&
            (await Promise.all(
              recipients.map((recipient) =>
                this.statusService.createStatus({
                  smtpConfigId,
                  emailTemplateId,
                  apiTokenId,
                  recipients: recipient,
                  data: JSON.stringify(sendMailRequestInput),
                  status: StatusEnum.FAILED,
                  retries: 0,
                  maxRetries: 3,
                  errorMessage: error.message,
                }),
              ),
            ));
        }
      }
      return true;
    } catch (error) {
      console.error('Error sending mail:', error.message);

      addStatus &&
        (await Promise.all(
          recipients.map((recipient) =>
            this.statusService.createStatus({
              smtpConfigId,
              emailTemplateId,
              apiTokenId,
              recipients: recipient,
              data: JSON.stringify(sendMailRequestInput),
              status: StatusEnum.FAILED,
              retries: 0,
              maxRetries: 3,
              errorMessage: error.message,
            }),
          ),
        ));
      return false;
    }
  }

  async retryFailedEmails(includeMaxTries: boolean = false) {
    let failedStatuses;
    if (includeMaxTries) {
      failedStatuses = await this.statusService.getFailedStatusesWithMaxTries();
    } else {
      failedStatuses = await this.statusService.getFailedStatuses();
    }
    let successCount = 0;
    let failedCount = 0;
    const totalCount = failedStatuses.length;

    for (const status of failedStatuses) {
      try {
        if (typeof status.data === 'string') {
          const sendMailRequestInput = JSON.parse(status.data);
          const isMailSent = await this.sendMail(sendMailRequestInput, false);

          await this.statusService.updateStatus(status.id, {
            status: isMailSent ? StatusEnum.SUCCESS : StatusEnum.FAILED,
            retries: status.retries + 1,
            errorMessage: isMailSent ? null : status.errorMessage,
            data: isMailSent ? null : sendMailRequestInput,
          });

          if (isMailSent) {
            successCount++;
          } else {
            failedCount++;
          }
        }
      } catch (error) {
        console.error(
          `Error retrying email for status ID ${status.id}:`,
          error.message,
        );
        await this.statusService.updateStatus(status.id, {
          retries: status.retries + 1,
          errorMessage: error.message,
        });
        failedCount++;
      }
    }

    return {
      totalMails: totalCount,
      successMails: successCount,
      failedMails: failedCount,
    };
  }

  async retryFailedEmail(id: string, smtpConfigId?: string) {
    let status;
    try {
      status = await this.statusService.getFailedStatus(id);
      if (!status) {
        throw new Error('Invalid status ID');
      }
    } catch (error) {
      return {
        status: 'failed',
        message: `Invalid status ID`,
      };
    }

    try {
      if (typeof status.data === 'string') {
        let sendMailRequestInput = JSON.parse(
          status.data,
        ) as SendMailRequestInput;

        if (smtpConfigId) {
          const smtpConfig =
            await this.smtpConfigsService.findOne(smtpConfigId);
          if (!smtpConfig) {
            return {
              status: 'failed',
              message: 'Invalid SMTP configuration ID',
            };
          }

          sendMailRequestInput = {
            ...sendMailRequestInput,
            smtpConfigId,
          };
        }

        const isMailSent = await this.sendMail(sendMailRequestInput, false);

        await this.statusService.updateStatus(status.id, {
          status: isMailSent ? StatusEnum.SUCCESS : StatusEnum.FAILED,
          retries: status.retries + 1,
          errorMessage: isMailSent ? null : status.errorMessage,
          data: isMailSent ? null : JSON.stringify(sendMailRequestInput),
          smtpConfigId: smtpConfigId
            ? smtpConfigId
            : sendMailRequestInput.smtpConfigId,
        });

        return {
          status: isMailSent ? 'success' : 'failed',
          message: isMailSent
            ? 'Email sent successfully'
            : 'Email sending failed',
        };
      }
    } catch (error) {
      console.error(
        `Error resending email for status ID ${status.id}:`,
        error.message,
      );
      await this.statusService.updateStatus(status.id, {
        retries: status.retries + 1,
        errorMessage: error.message,
      });

      return {
        status: 'failed',
        message: `Error resending email: ${error.message}`,
      };
    }
  }
  private buildMailOptions(
    from: string,
    to: string,
    cc: string[] | undefined,
    bcc: string[] | undefined,
    subject: string,
    html: string,
  ) {
    return {
      from,
      to,
      cc: cc?.join(','),
      bcc: bcc?.join(','),
      subject,
      html,
    };
  }
}
