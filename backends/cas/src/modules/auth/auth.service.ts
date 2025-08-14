import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // Assuming PrismaService is already created
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interface/jwt-payload.interface';
// import { User } from '@prisma/client';
type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  // Add other fields as needed from your Prisma user model
};
import { ValidateTokenResponse } from './dto/validate-token-response.dto';
import { MailClientService } from '../open-client/mail-client.service';
import { SuccessResponse } from '../common/dto/success-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private readonly mailClientService: MailClientService,
  ) {}

  // Centralized token generation
  private generateToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // Centralized token validation
  private validateJWT(token: string, secret: string): any {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async validateAccessToken(
    token: string,
    checkAdmin: boolean = false,
  ): Promise<ValidateTokenResponse> {
    const decodedToken: JwtPayload = await this.validateJWT(
      token,
      process.env.JWT_ACCESS_SECRET,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.casId, deletedAt: null, isActive: true },
    });

    // Validate user existence
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        field: 'email',
        message: 'User not found',
      });
    }

    // Validate token's `isAdmin` matches user's `isAdmin`
    const tokenIsAdmin = decodedToken.isAdmin ?? false;
    if (tokenIsAdmin !== user.isAdmin) {
      throw new UnauthorizedException({
        statusCode: 401,
        field: 'isAdmin',
        message: 'Token mismatch: Invalid permissions',
      });
    }

    // Additional check for admin privileges
    if (checkAdmin && !user.isAdmin) {
      throw new UnauthorizedException({
        statusCode: 403,
        field: 'isAdmin',
        message: 'Access denied: Admin privileges required',
      });
    }

    return {
      user: {
        casId: user.id,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      message: 'Successful',
      success: true,
    };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        statusCode: '401',
        field: 'email',
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return safeUser; // Return user without password
    }

    throw new UnauthorizedException({
      statusCode: '401',
      field: 'password',
      message: 'Wrong password',
    });
  }

  async login(user: User) {
    const payload = {
      casId: user.id,
      ...(user.isAdmin && { isAdmin: user.isAdmin }),
    };

    const accessToken = this.generateToken(
      payload,
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRATION,
    );
    const refreshToken = this.generateToken(
      { casId: user.id },
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRATION,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    const decodedToken = this.validateJWT(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
    const user = await this.prisma.user.findUnique({
      where: { id: decodedToken.casId, deletedAt: null, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.generateToken(
      { casId: user.id, ...(user.isAdmin && { isAdmin: user.isAdmin }) },
      process.env.JWT_ACCESS_SECRET,
      process.env.JWT_ACCESS_EXPIRATION,
    );

    return {
      accessToken: newAccessToken, // Reuse the same refresh token
    };
  }

  async generatePasswordResetToken(
    userId: string,
    email: string,
  ): Promise<SuccessResponse> {
    const token = await this.generateTokenById(userId);

    const emailInput = {
      smtpConfigId: process.env.SMTP_CONFIG_ID,
      emailTemplateId: process.env.EMAIL_TEMPLATE_ID,
      recipients: email,
      data: {
        subject: 'Reset Your Password – Open CAS',
        heading: 'Password Reset Request',
        body: [
          {
            type: 'text',
            text: `<p>We received a request to reset your password for <strong>SEIDOR Opentrends India</strong>. If you made this request, please reset your password by clicking the link below:</p>
          <p>🔗 <strong><a href="${process.env.CAS_FRONTEND_URL}/auth/change-password?token=${token}" rel="noopener noreferrer" target="_blank">Reset Password</a></strong></p>
          <p>If you did not request a password reset, please ignore this email or contact support.</p>`,
          },
        ],
      },
    };

    await this.mailClientService.sendMail(emailInput);
    return { message: 'Password reset mail send successfully', success: true };
  }

  async generateTokenById(userId: string): Promise<string> {
    return this.generateToken(
      { casId: userId },
      process.env.JWT_RESET_PASSWORD_SECRET,
      process.env.JWT_RESET_PASSWORD_EXPIRATION,
    );
  }

  async verifyResetToken(token: string): Promise<string> {
    const decodedToken = this.validateJWT(
      token,
      process.env.JWT_RESET_PASSWORD_SECRET,
    );
    return decodedToken.casId;
  }
}
