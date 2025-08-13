import { Injectable } from '@nestjs/common';
import { CreateHistoryInput } from './dto/create-history.input';
import { PrismaService } from '../prisma/prisma.service';
import { FilterHistoryInput } from './dto/filter-history.input';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  create(createHistoryInput: CreateHistoryInput) {
    return this.prisma.history.create({
      data: {
        ...createHistoryInput,
        changes: createHistoryInput.changes as any, // Casting to avoid TypeScript issues
      },
    });
  }

  async getHistory(filter: FilterHistoryInput) {
    const where: any = {};

    if (filter.entityId) {
      where.entityId = filter.entityId;
    }

    if (filter.changedBy) {
      where.changedBy = filter.changedBy;
    }

    if (filter.startDate && filter.endDate) {
      where.changedAt = {
        gte: new Date(filter.startDate),
        lte: new Date(filter.endDate),
      };
    } else if (filter.startDate) {
      where.changedAt = {
        gte: new Date(filter.startDate),
      };
    } else if (filter.endDate) {
      where.changedAt = {
        lte: new Date(filter.endDate),
      };
    }

    return this.prisma.history.findMany({
      where,
      orderBy: {
        changedAt: 'desc',
      },
    });
  }
}
