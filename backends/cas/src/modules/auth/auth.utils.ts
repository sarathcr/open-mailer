import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

export async function handleTokenValidation(
  accessToken: string | undefined,
  refreshToken: string | undefined,
  authService: any,
  res: Response,
  checkAdmin: boolean = false, // Optional flag for admin validation
): Promise<boolean> {
  // Validate access token if present
  if (accessToken) {
    const isValid = await authService.validateAccessToken(
      accessToken,
      checkAdmin,
    );
    if (isValid) {
      return true;
    }
  }

  // Validate refresh token if access token is invalid/missing
  if (refreshToken) {
    try {
      const { accessToken: newAccessToken } =
        await authService.refreshTokens(refreshToken);

      // Set new access token in cookies
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.COOKIE_ACCESS_EXPIRATION, 10), // e.g., 15 minutes
        sameSite: 'lax',
      });

      const isValid = await authService.validateAccessToken(
        newAccessToken,
        checkAdmin,
      );
      if (isValid) {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException(`${error.message || error}`);
    }
  }

  // If neither token is valid
  throw new UnauthorizedException('Access denied: No valid tokens provided');
}
