import { Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { PrismaService } from '../prisma/prisma.service';
import { StatuSFilterInput } from './dto/status-filter.input';
import { MailCount, StatusEnum } from './entities/status.entity';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginationResult } from '../utils';
import { Status } from '@prisma/client';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  createStatus(data: CreateStatusInput) {
    return this.prisma.status.create({ data });
  }

  async getStatuses(
    filterInput?: StatuSFilterInput,
    pagination?: PaginationInput,
    search?: string,
  ): Promise<PaginationResult<Status>> {
    const whereClause = this.buildWhereClause(filterInput, search);

    const isValidPagination =
      pagination && pagination.page > 0 && pagination.limit > 0;

    const statuses = await this.prisma.status.findMany({
      where: whereClause,
      include: {
        apiToken: { select: { id: true, name: true } },
        emailTemplate: { select: { id: true, name: true } },
        smtpConfig: { select: { id: true, from: true } },
      },
      orderBy: { createdAt: 'desc' },
      ...(isValidPagination && {
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
    });

    const total = await this.prisma.status.count({ where: whereClause });

    if (isValidPagination) {
      return {
        data: statuses,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      };
    }

    return {
      data: statuses,
      total: statuses.length,
      page: 1,
      limit: statuses.length,
      totalPages: 1,
    };
  }

  async getMailCounts(): Promise<MailCount> {
    const counts = await this.prisma.status.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const result = {
      total: await this.prisma.status.count(),
      pending: 0,
      failed: 0,
      success: 0,
    };

    counts.forEach(({ status, _count }) => {
      result[status.toLowerCase()] = _count.status;
    });

    return result;
  }

  getStatusById(id: string) {
    return this.prisma.status.findUnique({ where: { id } });
  }

  updateStatus(id: string, data: UpdateStatusInput) {
    return this.prisma.status.update({
      where: { id },
      data,
    });
  }

  deleteStatus(id: string) {
    return this.prisma.status.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  getFailedStatusesWithMaxTries() {
    return this.prisma.status.findMany({
      where: {
        status: StatusEnum.FAILED,
        retries: { lt: this.prisma.status.fields.maxRetries },
      },
    });
  }

  getFailedStatuses() {
    return this.prisma.status.findMany({
      where: {
        status: StatusEnum.FAILED,
      },
    });
  }

  getFailedStatus(id: string) {
    return this.prisma.status.findUnique({
      where: {
        id,
        status: StatusEnum.FAILED,
      },
    });
  }

  private buildWhereClause(filterInput: StatuSFilterInput, search: string) {
    const { status, startDate, endDate } = filterInput || {};

    const whereClause: any = {};

    if (status) whereClause.status = status;
    if (startDate) whereClause.createdAt = { gte: startDate };
    if (endDate) {
      whereClause.createdAt = {
        ...(whereClause.createdAt || {}),
        lte: endDate,
      };
    }

    if (search) {
      whereClause.OR = [
        { apiToken: { name: { contains: search, mode: 'insensitive' } } },
        { emailTemplate: { name: { contains: search, mode: 'insensitive' } } },
        { smtpConfig: { from: { contains: search, mode: 'insensitive' } } },
        { recipients: { contains: search, mode: 'insensitive' } },
      ];
    }

    return whereClause;
  }
}
