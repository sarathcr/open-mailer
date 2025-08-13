import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verifyJwtToken } from '../utils/jwt.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const userHeader = req.headers['x-user'];

    if (!userHeader) {
      throw new UnauthorizedException('Access denied');
    }

    const token = this.extractToken(userHeader);
    const user = this.validateToken(token);

    if (!user?.casId) {
      throw new UnauthorizedException('Access denied');
    }

    // Map casId to id
    const transformedUser = { ...user, id: user.casId };
    delete transformedUser.casId;

    // Attach the transformed user to the context
    gqlContext.getContext().user = transformedUser;

    return true;
  }

  /**
   * Extracts and parses the JWT token from the `x-user` header.
   * @param userHeader - The value of the `x-user` header.
   */
  private extractToken(userHeader: string | string[]): string {
    try {
      const rawHeader = Array.isArray(userHeader) ? userHeader[0] : userHeader;
      return JSON.parse(rawHeader); // Parse the JSON-encoded token
    } catch {
      throw new BadRequestException('Invalid request');
    }
  }

  /**
   * Validates the JWT token and returns the decoded user.
   * @param token - The JWT token to validate.
   */
  private validateToken(token: string): any {
    try {
      return verifyJwtToken(token); // Add JWT secret if required
    } catch {
      throw new UnauthorizedException('Access denied');
    }
  }
}
