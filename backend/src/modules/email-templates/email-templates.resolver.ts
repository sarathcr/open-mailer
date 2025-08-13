import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { KongJwtGuard } from '../auth/guard/kong-jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PaginationInput } from '../common/dto/pagination.input';
import { SortInput } from '../common/dto/sort.input';
import { CreateEmailTemplateInput } from './dto/create-email-template.input';
import { EmailTemplatePaginationOutput } from './dto/email-template-pagination.output';
import { FilterEmailTemplateInput } from './dto/filter-email-template.input';
import { UpdateEmailTemplateInput } from './dto/update-email-template.input';
import { EmailTemplateService } from './email-templates.service';
import { EmailTemplate } from './entities/email-template.entity';
@Resolver(() => EmailTemplate)
@UseGuards(KongJwtGuard, RolesGuard)
export class EmailTemplateResolver {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Mutation(() => EmailTemplate)
  async createEmailTemplate(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ) {
    return this.emailTemplateService.create(createEmailTemplateInput);
  }

  @Query(() => EmailTemplatePaginationOutput)
  async findAllEmailTemplates(
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput,
    @Args('filter', { type: () => FilterEmailTemplateInput, nullable: true })
    filter?: FilterEmailTemplateInput,
    @Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.emailTemplateService.findAll(pagination, filter, sort, search);
  }

  @Query(() => EmailTemplate)
  async findOneEmailTemplate(@Args('id') id: string) {
    return this.emailTemplateService.findOne(id);
  }

  @Mutation(() => EmailTemplate)
  async updateEmailTemplate(
    @Args('id') id: string,
    @Args('updateEmailTemplateInput')
    updateEmailTemplateInput: UpdateEmailTemplateInput,
  ) {
    return this.emailTemplateService.update(id, updateEmailTemplateInput);
  }

  @Mutation(() => EmailTemplate)
  async removeEmailTemplate(@Args('id') id: string) {
    return await this.emailTemplateService.remove(id);
  }

  @Mutation(() => EmailTemplate)
  async softDeleteTemplate(@Args('id', { type: () => String }) id: string) {
    return await this.emailTemplateService.softDeleteTemplate(id);
  }
  @Mutation(() => EmailTemplate)
  async restoreTemplate(@Args('id', { type: () => String }) id: string) {
    return await this.emailTemplateService.restoreTemplate(id);
  }
}

// Payload sample

// mutation {
//   createEmailTemplate(createEmailTemplateInput: {
//     name: "Front End Tesst",
//     filePath: "https://shraddhagames.vercel.app/default.html",
//     footerContent: "You received this email due to recent activity in one of our applications. If this email isn’t relevant to you or wasn’t intended for you, please disregard it <br><br> © RTH Opentrends. All rights reserved.",
//     primaryImageUrl: "https://shraddhagames.vercel.app/logo.png",
//     primaryLinkUrl:"google.com",
//     secondaryImageUrl: "https://shraddhagames.vercel.app/logo%20(1).png",
//     secondaryLinkUrl: "yahoo.com",
//   }) {
//     id
//     name
//     from
//     filePath
//     primaryImageUrl
//     primaryLinkUrl
//     secondaryImageUrl
//     secondaryLinkUrl
//     footerContent
//     createdAt
//     updatedAt
//     deletedAt
//   }
// }
