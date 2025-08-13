import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSmtpConfigInput } from './dto/create-smtp-config.input';
import { UpdateSmtpConfigInput } from './dto/update-smtp-config.input';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationInput } from '../common/dto/pagination.input';
import { FilterSmtpConfigInput } from './dto/filter-smtp-config.input';
import { SortInput } from '../common/dto/sort.input';
import { SmtpConfigPaginationOutput } from './dto/smtp-config-pagination.output';
import { decryptData, encryptData, paginate } from '../utils';
import * as nodemailer from 'nodemailer';
import { Prisma } from '@prisma/client';

@Injectable()
export class SmtpConfigsService {
  constructor(private prisma: PrismaService) {}

  async create(createSmtpConfigInput: CreateSmtpConfigInput) {
    const { password, username, ...rest } = createSmtpConfigInput;
    const encryptedPassword = encryptData(password, username);
    try {
      await this.verifySmtpCredentials({
        ...rest,
        username,
        password: encryptedPassword,
      });
    } catch (error) {
      throw new BadRequestException(
        `SMTP Verification failed: ${error.message}`,
      );
    }
    return this.prisma.sMTPConfig.create({
      data: { ...rest, username, password: encryptedPassword, deletedAt: null },
    });
  }

  async findAll(
    pagination?: PaginationInput,
    filter?: FilterSmtpConfigInput,
    sort?: SortInput,
    search?: string,
  ): Promise<SmtpConfigPaginationOutput> {
    const where: Prisma.SMTPConfigWhereInput = {
      AND: [
        filter?.createdAt ? { createdAt: filter.createdAt } : undefined,
        filter?.updatedAt ? { updatedAt: filter.updatedAt } : undefined,
        filter?.isBackUp !== undefined
          ? { isBackUp: filter.isBackUp }
          : undefined,
      ].filter(Boolean),
    };

    if (filter?.hasDeleted !== undefined) {
      where.deletedAt = filter.hasDeleted ? { not: null } : { equals: null };
    } else {
      where.deletedAt = { equals: null }; // Default behavior if hasDeleted is not provided
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { host: { contains: search, mode: 'insensitive' } },
      ];
    }
    // Check if pagination is provided and valid
    const isValidPagination =
      pagination && pagination.page > 0 && pagination.limit > 0;

    // Fetch SMTP configurations with filters, sorting, and pagination (if provided)
    const data = await this.prisma.sMTPConfig.findMany({
      where,
      ...(isValidPagination && {
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      orderBy: sort
        ? { [sort.sortBy]: sort.sortDirection }
        : { createdAt: 'desc' }, // Default sorting
    });

    if (isValidPagination) {
      const total = await this.prisma.sMTPConfig.count({ where });

      // Return paginated response
      return paginate(data, total, pagination);
    }

    // Return all SMTP configurations if no valid pagination is applied
    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
      totalPages: 1,
    };
  }

  async findOne(id: string) {
    const smtpConfig = await this.prisma.sMTPConfig.findUnique({
      where: { id },
    });

    if (!smtpConfig) {
      throw new NotFoundException(`SMTP configuration with ID ${id} not found`);
    }

    return smtpConfig;
  }

  async update(id: string, updateSmtpConfigInput: UpdateSmtpConfigInput) {
    const existingSmtpConfig = await this.prisma.sMTPConfig.findUnique({
      where: { id },
    });

    if (!existingSmtpConfig) {
      throw new Error(`SMTP configuration with id ${id} not found`);
    }

    // Handle password encryption if a new password is provided
    const { password, username, ...rest } = updateSmtpConfigInput;
    let encryptedPassword = existingSmtpConfig.password; // Retain existing password by default
    const updatedUsername = username || existingSmtpConfig.username;

    if (password) {
      if (!username) {
        throw new Error('Username is required');
      }
      encryptedPassword = encryptData(password, username);
    }

    // Verify SMTP credentials
    try {
      await this.verifySmtpCredentials({
        ...rest,
        username: updatedUsername,
        password: encryptedPassword,
        secure: existingSmtpConfig.secure,
        from: existingSmtpConfig.from,
      });
    } catch (error) {
      throw new BadRequestException(
        `SMTP Verification failed: ${error.message}`,
      );
    }

    // Update the database
    return this.prisma.sMTPConfig.update({
      where: { id },
      data: {
        ...rest,
        username,
        password: encryptedPassword,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const smtpConfig = await this.prisma.sMTPConfig.findUnique({
      where: { id },
    });

    if (!smtpConfig) {
      throw new NotFoundException(`SMTP configuration with ID ${id} not found`);
    }

    return this.prisma.sMTPConfig.delete({
      where: { id },
    });
  }
  async softdeleteSmtp(id: string) {
    const data = { deletedAt: new Date() };
    const smtpConfig = await this.prisma.sMTPConfig.findUnique({
      where: { id },
    });

    if (!smtpConfig) {
      throw new NotFoundException(`SMTP configuration with ID ${id} not found`);
    }

    return this.prisma.sMTPConfig.update({
      where: { id },
      data,
    });
  }
  async restoreSmtp(id: string): Promise<any> {
    return this.prisma.sMTPConfig.update({
      where: { id },
      data: { deletedAt: null }, // Set `deletedAt` to null to restore
    });
  }

  /**
   * Applies default values for SMTP and decrypts the password.
   * Uses optional chaining to avoid null/undefined errors.
   */
  applySMTPDefaults(input: CreateSmtpConfigInput) {
    const { password, username, secure, host, port, from } = input;
    const defaultHost = 'smtp.gmail.com';
    const isSecure = secure ?? false;
    const defaultPort = isSecure ? 465 : 587;
    const decryptedPassword = decryptData(password, username);

    return {
      host: host || defaultHost,
      port: port || defaultPort,
      secure: isSecure,
      from: from,
      auth: {
        user: username,
        pass: decryptedPassword,
      },
    };
  }

  /**
   * Verifies the SMTP credentials using Nodemailer.
   * Throws an error if the credentials are invalid.
   */
  async verifySmtpCredentials(createSmtpConfigInput: CreateSmtpConfigInput) {
    const smtpOptions = this.applySMTPDefaults(createSmtpConfigInput);
    try {
      const transporter = nodemailer.createTransport(smtpOptions);
      await transporter.verify();
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }
}
