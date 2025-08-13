import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ApiToken } from '../api-token/entities/api-token.entity';
import { KongJwtGuard } from '../auth/guard/kong-jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentApp } from '../common/decorator/current-app.decorator';
import { SendMailRequestInput } from './dto/send-mail.input';
import {
  RetryMailEntity,
  RetryMailsEntity,
} from './entities/retry-mail.entity';
import { MailService } from './mail.service';

@Resolver()
@UseGuards(KongJwtGuard, RolesGuard)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => Boolean)
  async sendMail(
    @Args('input', { type: () => SendMailRequestInput })
    sendMailRequestInput: SendMailRequestInput,
    @CurrentApp() apiToken: ApiToken,
  ): Promise<boolean> {
    return await this.mailService.sendMail({
      ...sendMailRequestInput,
      apiTokenId: apiToken.id,
    });
  }

  @Mutation(() => RetryMailsEntity, { name: 'retryFailedEmails' })
  retryFailedEmails(): Promise<RetryMailsEntity> {
    return this.mailService.retryFailedEmails();
  }

  @Mutation(() => RetryMailEntity, { name: 'retryFailedEmail' })
  async retryFailedEmail(
    @Args('id', { type: () => String }) id: string,
    @Args('smtpConfigId', { type: () => String, nullable: true })
    smtpConfigId?: string,
  ) {
    return this.mailService.retryFailedEmail(id, smtpConfigId);
  }
}

// Payload sample

// mutation {
//   sendMail(
//     input: {
//       smtpConfigId: "6740960085de78edcf4c9c20"
//       emailTemplateId: "67373b33640c2033432260a1"
//       recipients: "rpadinjareambattu@opentrends.net"
//       data: { subject: "Welcome to Open FE", heading: "Getting Started with Open FE",
//            body: [
//              {
//       type: "text",
//       text: "<b>Welcome to Open FE!</b><br><br> We're excited to have you onboard. Here's how you can get started.",
//       textAlign: "left"
//     },
//     {
//       type: "button",
//       buttonText: "Get Started",
//       buttonLink: "https://example.com/start",
//       align: "center"
//     },
//     {
//       type: "text",
//       text: "Welcome to Open FE! We're excited to have you onboard. Here's how you can get started.",
//       textAlign: "center"
//     },
//   {
//       type: "buttons",
//       buttons: [
//         {
//           text: "Visit Documentation",
//           link: "https://example.com/docs"
//         },
//         {
//           text: "Join the Community",
//           link: "https://example.com/community"
//         }
//       ],
//       align: "center"
//     },

//     {
//       type: "text",
//       text: "Welcome to Open FE! We're excited to have you onboard. Here's how you can get started.",
//       textAlign: "left"
//     },
//   ] }
//     }
//   )
// }
