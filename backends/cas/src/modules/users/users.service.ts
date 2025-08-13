import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { HistoryService } from '../history/history.service';
import { ChangeType, EntityType } from '../history/types';
import { User } from '@prisma/client';
import { createHistoryData } from '../history/utils';
import { FilterUserInput } from './dto/filter-user-input';
import { PaginationInput } from '../common/dto/pagination.input';
import { paginate, PaginationResult } from '../common/utils';
import { MailClientService } from '../open-client/mail-client.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private historyService: HistoryService,
    private authService: AuthService,
    private readonly mailClientService: MailClientService,
  ) {}

  async create(
    createUserInput: CreateUserInput,
    currentUser: User,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: { ...createUserInput, deletedAt: null },
    });

    await this.historyService.create({
      entityId: user.id,
      entityType: EntityType.USER,
      changes: [],
      changeType: ChangeType.CREATE,
      changedBy: currentUser.id,
      changedByName: `${currentUser.firstName} ${currentUser.lastName}`,
    });
    const token = await this.authService.generateTokenById(user.id);

    const emailInput = {
      smtpConfigId: process.env.SMTP_CONFIG_ID,
      emailTemplateId: process.env.EMAIL_TEMPLATE_ID,
      recipients: user.email,
      data: {
        subject: 'Welcome to Open CAS – Set Up Your Account',
        heading: 'Account Activation – Set Your Password',
        body: [
          {
            type: 'text',
            text: `<p>You have been added as a user in <strong>SEIDOR Opentrends India</strong> by an administrator. To activate your account, please set up your password by clicking the link below:</p><p>🔗 <strong><a href="${process.env.CAS_FRONTEND_URL}/auth/change-password?token=${token}" rel="noopener noreferrer" target="_blank">Reset Password</a></strong></p><p>This link will direct you to a secure page where you can create your password. Once set, you can log in using your credentials.</p>`,
          },
        ],
      },
    };

    await this.mailClientService.sendMail(emailInput);

    return user;
  }

  async findAll(
    filter?: FilterUserInput,
    pagination?: PaginationInput,
    search?: string,
  ): Promise<PaginationResult<User> | User[]> {
    const where: any = {};

    // Apply filters based on filter object
    if (filter?.isAdmin !== undefined) {
      where.isAdmin = filter.isAdmin;
    }

    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter?.hasDeleted !== undefined) {
      where.deletedAt = filter.hasDeleted ? { not: null } : { equals: null };
    } else {
      where.deletedAt = { equals: null }; // Default behavior if hasDeleted is not provided
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Check if pagination is provided and valid
    const isValidPagination =
      pagination && pagination.page > 0 && pagination.limit > 0;

    // Fetch users with filters, sorting, and pagination (if provided)
    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(isValidPagination && {
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
    });

    if (isValidPagination) {
      const totalUsers = await this.prisma.user.count({ where });

      // Return paginated response
      return paginate(users, totalUsers, pagination);
    }

    // Return all users if no valid pagination is applied
    return {
      data: users,
      total: users.length,
      page: 1,
      limit: users.length,
      totalPages: 1,
    };
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        histories: true,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    currentUser: User,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });

    const changes = createHistoryData(user, updatedUser);

    await this.historyService.create({
      entityId: id,
      entityType: EntityType.USER,
      changes: changes,
      changeType: ChangeType.UPDATE,
      changedBy: currentUser.id,
      changedByName: `${currentUser.firstName} ${currentUser.lastName}`,
    });

    return updatedUser;
  }

  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isPasswordChanging) {
      throw new BadRequestException('Password reset not initiated');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isPasswordChanging: false,
      },
    });
    return { success: true };
  }

  async softDeleteUser(userId: string, currentUser: User): Promise<any> {
    const data = { deletedAt: new Date(), isActive: false };
    const deletedUser = this.prisma.user.update({
      where: { id: userId },
      data, // Set current date to `deletedAt`
    });

    const changes = createHistoryData({}, data);

    await this.historyService.create({
      entityId: userId,
      entityType: EntityType.USER,
      changes: changes,
      changeType: ChangeType.DELETE,
      changedBy: currentUser.id,
      changedByName: `${currentUser.firstName} ${currentUser.lastName}`,
    });

    return deletedUser;
  }

  async restoreUser(userId: string): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null }, // Set `deletedAt` to null to restore
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async initiatePasswordReset(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isPasswordChanging: true },
    });

    return user;
  }
}
