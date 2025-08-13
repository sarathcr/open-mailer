import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateApiTokenInput } from './dto/create-api-token.input';
import {
  ApiTokenStatus,
  UpdateApiTokenInput,
} from './dto/update-api-token.input';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationInput } from '../common/dto/pagination.input';
import { paginate, PaginationResult } from '../utils';
import { ApiToken } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserInput } from '../common/dto/user.input';

@Injectable()
export class ApiTokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createApiTokenInput: CreateApiTokenInput, createdBy: UserInput) {
    const { name, duration } = createApiTokenInput;

    // Calculate expiration date
    let expireAt: Date | null = null;
    if (duration !== 0) {
      // Duration of 0 means unlimited
      expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + duration); // Add duration in days
    }
    const updatedAt = new Date();

    // Create the token entity in the database
    const tokenEntity = await this.prisma.apiToken.create({
      data: {
        name,
        duration,
        expireAt,
        status: ApiTokenStatus.ACTIVE,
        deletedAt: null,
        updatedAt,
        createdBy: {
          id: createdBy.id,
          isAdmin: createdBy.isAdmin,
          firstName: createdBy.firstName,
          lastName: createdBy.lastName,
          email: createdBy.email,
        },
      },
    });

    const token = this.generateJWT(tokenEntity.id, updatedAt, expireAt);

    // Return the token entity along with the generated JWT
    return { ...tokenEntity, token };
  }

  async findAll(
    pagination?: PaginationInput,
    search?: string,
    filter?: { status?: string; isExpired?: boolean; deleted?: boolean },
  ): Promise<PaginationResult<ApiToken>> {
    const where: any = {};

    // Apply search filter
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Apply status filter
    if (filter?.status) {
      where.status = filter.status;
    }

    // Apply expiration filter
    if (filter?.isExpired !== undefined) {
      where.expireAt = filter.isExpired
        ? { lt: new Date() }
        : { gt: new Date() };
    }

    // Apply deleted filter
    if (filter?.deleted !== undefined) {
      where.deletedAt = filter.deleted ? { not: null } : { equals: null };
    } else {
      where.deletedAt = { equals: null }; // Default behavior if `deleted` is not provided
    }

    // Check for valid pagination
    const isValidPagination =
      pagination && pagination.page > 0 && pagination.limit > 0;

    // Fetch filtered and paginated data
    const apiTokens = await this.prisma.apiToken.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(isValidPagination && {
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
    });

    const total = await this.prisma.apiToken.count({ where });

    // If pagination is valid, return paginated result
    if (isValidPagination) {
      return paginate(apiTokens, total, pagination);
    }

    // If no valid pagination, return all tokens
    return {
      data: apiTokens,
      total: apiTokens.length,
      page: 1,
      limit: apiTokens.length,
      totalPages: 1,
    };
  }
  findOne(id: string) {
    return this.prisma.apiToken.findUnique({ where: { id } });
  }

  async update(id: string, updateApiTokenInput: UpdateApiTokenInput) {
    const token = await this.prisma.apiToken.findUnique({ where: { id } });
    if (!token) {
      throw new NotFoundException('API Token not found');
    }

    // Calculate expiration date if duration is provided
    let expireAt: Date | null = token.expireAt;
    if (updateApiTokenInput.duration !== undefined) {
      if (updateApiTokenInput.duration === 0) {
        expireAt = null;
      } else {
        expireAt = new Date(token.createdAt);
        expireAt.setDate(expireAt.getDate() + updateApiTokenInput.duration);
      }
    }
    const updatedAt = new Date(); // Ensure this is initialized

    const updatedToken = await this.prisma.apiToken.update({
      where: { id },
      data: {
        ...updateApiTokenInput,
        expireAt,
        updatedAt,
      },
    });
    const newJwt = this.generateJWT(
      updatedToken.id,
      updatedToken.updatedAt,
      updatedToken.expireAt,
    );

    return { ...updatedToken, token: newJwt };
  }

  async softDelete(id: string): Promise<ApiToken> {
    return this.prisma.apiToken.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Restore API token by clearing `deletedAt`
  async restore(id: string): Promise<ApiToken> {
    return this.prisma.apiToken.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  // Permanently remove API token
  async remove(id: string): Promise<ApiToken> {
    return this.prisma.apiToken.delete({
      where: { id },
    });
  }

  async regenerateToken(id: string) {
    const tokenEntity = await this.findOne(id);
    const token = this.generateJWT(
      tokenEntity.id,
      tokenEntity.updatedAt,
      tokenEntity.expireAt,
    );

    return { token };
  }

  generateJWT = (
    id,
    updatedAt,
    expireAt = null,
    secret = process.env.JWT_ACCESS_SECRET,
  ) => {
    if (!id) {
      throw new Error("An 'id' is required to generate the JWT.");
    }
    if (!secret) {
      throw new Error('A secret key is required to sign the JWT.');
    }

    const jwtPayload = { id, updatedAt };
    const jwtOptions = expireAt
      ? {
          secret,
          expiresIn: `${(expireAt.getTime() - Date.now()) / 1000}s`,
        } // Time in seconds
      : { secret }; // No expiration for unlimited tokens

    return this.jwtService.sign(jwtPayload, jwtOptions);
  };

  async validateToken(token: string, secret = process.env.JWT_ACCESS_SECRET) {
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Decode the token
      const decoded = this.jwtService.verify(token, { secret });

      // Fetch the token details from the database
      const apiToken = await this.prisma.apiToken.findUnique({
        where: { id: decoded.id },
      });

      if (!apiToken) {
        throw new UnauthorizedException('Token not found');
      }

      // Check token status and expiration
      if (apiToken.status !== 'ACTIVE') {
        throw new UnauthorizedException('Token is not active');
      }

      if (apiToken.expireAt && apiToken.expireAt < new Date()) {
        throw new UnauthorizedException('Token has expired');
      }

      // Compare `updatedAt` from database with the `updatedAt` value in the JWT payload
      if (
        new Date(apiToken.updatedAt).toISOString() !==
        new Date(decoded.updatedAt).toISOString()
      ) {
        throw new UnauthorizedException(
          'Token has been invalidated due to an update',
        );
      }

      return apiToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
