import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'; // Import Prisma for QueryMode
import { PaginationInput } from '../common/dto/pagination.input';
import { SortDirection, SortInput } from '../common/dto/sort.input';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../utils';
import { CreateEmailTemplateInput } from './dto/create-email-template.input';
import { EmailTemplatePaginationOutput } from './dto/email-template-pagination.output';
import { FilterEmailTemplateInput } from './dto/filter-email-template.input';
import { UpdateEmailTemplateInput } from './dto/update-email-template.input';
import { EmailTemplate } from './entities/email-template.entity';

@Injectable()
export class EmailTemplateService {
  constructor(private prisma: PrismaService) {}

  async create(
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.create({
      data: { ...createEmailTemplateInput, deletedAt: null },
    });
  }

  async findAll(
    pagination: PaginationInput,
    filter?: FilterEmailTemplateInput,
    sort?: SortInput,
    search?: string,
  ): Promise<EmailTemplatePaginationOutput> {
    const { sortBy = 'createdAt', sortDirection = SortDirection.ASC } =
      sort || {};
    // Building the filter criteria
    const where: Prisma.EmailTemplateWhereInput = {
      AND: [
        filter?.createdAt ? { createdAt: filter.createdAt } : undefined,
        filter?.updatedAt ? { updatedAt: filter.updatedAt } : undefined,
      ].filter(Boolean),
    };
    if (filter?.hasDeleted !== undefined) {
      where.deletedAt = filter.hasDeleted ? { not: null } : { equals: null };
    } else {
      where.deletedAt = { equals: null }; // Default behavior if hasDeleted is not provided
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { filePath: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Check if pagination is provided and valid
    const isValidPagination =
      pagination && pagination.page > 0 && pagination.limit > 0;

    // Fetch data with filters, sorting, and pagination (if provided)
    const data = await this.prisma.emailTemplate.findMany({
      where,
      ...(isValidPagination && {
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      orderBy: { [sortBy]: sortDirection },
    });

    if (isValidPagination) {
      const total = await this.prisma.emailTemplate.count({ where });

      // Return paginated result using the paginate function
      return paginate(data, total, pagination);
    }

    // Return all data if no valid pagination is applied
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
      totalPages: 1,
    };
  }

  async findOne(id: string): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateEmailTemplateInput: UpdateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.update({
      where: { id },
      data: { ...updateEmailTemplateInput },
    });
  }

  async softDeleteTemplate(id: string): Promise<any> {
    const data = { deletedAt: new Date() };

    const deletedTemplate = this.prisma.emailTemplate.update({
      where: { id },
      data, // Set current date to `deletedAt`
    });

    return deletedTemplate;
  }
  async restoreTemplate(id: string): Promise<any> {
    return this.prisma.emailTemplate.update({
      where: { id },
      data: { deletedAt: null }, // Set `deletedAt` to null to restore
    });
  }

  async remove(id: string): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.delete({
      where: { id },
    });
  }
}
