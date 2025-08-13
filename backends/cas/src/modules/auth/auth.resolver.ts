import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { SuccessResponse } from '../common/dto/success-response.dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { UpdatePasswordInput } from '../users/dto/update-password.input';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { GqlContext } from './decorator/graphql-context.decorator';
import { ValidateTokenResponse } from './dto/validate-token-response.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Mutation(() => SuccessResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @GqlContext() context: { res: Response },
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.authService.login(user);

    // Set cookies via context (response object)
    context.res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.COOKIE_ACCESS_EXPIRATION), // 15 minutes
      sameSite: 'lax',
      path: '/',
      domain: '.opentrends.net', // only if needed
    });

    context.res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.COOKIE_REFRESH_EXPIRATION), // 7 days
      sameSite: 'lax',
      path: '/',
      domain: '.opentrends.net', // only if needed
    });

    return {
      success: true,
      message: 'Login successful',
    };
  }

  @Mutation(() => SuccessResponse)
  async logout(@Context() context: any) {
    context.res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: '.opentrends.net', // only if needed
    });
    context.res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: '.opentrends.net', // only if needed
    });
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  @Mutation(() => ValidateTokenResponse)
  async validateToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<ValidateTokenResponse> {
    const accessToken = context.req.cookies?.access_token;
    const res = await this.authService.validateAccessToken(accessToken, false);
    return res;
  }

  @Mutation(() => SuccessResponse)
  async validateAdminToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<SuccessResponse> {
    const accessToken = context.req.cookies?.access_token;

    const res = await this.authService.validateAccessToken(accessToken, false);
    return {
      success: res.success,
      message: 'Successful',
    };
  }

  @Mutation(() => SuccessResponse)
  async refreshTokens(
    @Context() context: { req: Request; res: Response },
  ): Promise<SuccessResponse> {
    const refreshToken = context.req.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const { accessToken } = await this.authService.refreshTokens(refreshToken);

    context.res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.COOKIE_ACCESS_EXPIRATION), // 15 minutes
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Refresh Tokens successful',
    };
  }

  @Mutation(() => SuccessResponse)
  async resetPassword(
    @Args('token') token: string,
    @Args('input') input: UpdatePasswordInput,
  ): Promise<SuccessResponse> {
    const userId = await this.authService.verifyResetToken(token);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    await this.userService.updatePassword(userId, input.password);

    return {
      success: true,
      message: 'Successful',
    };
  }

  @Mutation(() => SuccessResponse)
  async generatePasswordResetToken(
    @Args('email') email: string,
  ): Promise<SuccessResponse> {
    const user = await this.userService.initiatePasswordReset(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return await this.authService.generatePasswordResetToken(user.id, email);
  }

  @Query(() => UserEntity)
  @UseGuards(AuthGuard)
  async protectedQuery(@CurrentUser() user: UserEntity) {
    return this.userService.findOne(user.id);
  }
}
