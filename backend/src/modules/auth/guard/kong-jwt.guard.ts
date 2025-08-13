// src/auth/guards/kong-jwt.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { assertIssuerAndAudience } from '../guard.util';

type KeycloakAccessToken = {
  sub?: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  [k: string]: any;
};

function decodeJwtPayload<T = any>(jwt?: string): T | undefined {
  if (!jwt) return undefined;
  const parts = jwt.split('.');
  if (parts.length < 2) return undefined;
  try {
    const json = Buffer.from(
      parts[1].replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString('utf8');
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

@Injectable()
export class KongJwtGuard implements CanActivate {
  private requireKong = process.env.REQUIRE_KONG === 'true'; // optional hardening
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { req } = this.getReq(ctx);

    if (this.requireKong) {
      const viaKong =
        !!req.headers['x-consumer-id'] ||
        !!req.headers['x-consumer-username'] ||
        !!req.headers['x-credential-identifier'];
      if (!viaKong) throw new UnauthorizedException('Gateway required');
    }

    // Decode user from Authorization (Kong already validated the JWT)
    const authz = Array.isArray(req.headers['authorization'])
      ? req.headers['authorization'][0]
      : req.headers['authorization'];
    const token = authz?.startsWith('Bearer ') ? authz.slice(7) : undefined;

    const user = decodeJwtPayload<KeycloakAccessToken>(token);

    if (!user) throw new UnauthorizedException('No authenticated user');

    assertIssuerAndAudience(user);

    (req as any).user = user;
    return true;
  }

  private getReq(ctx: ExecutionContext) {
    if (ctx.getType<'graphql'>() === 'graphql') {
      const g = GqlExecutionContext.create(ctx);
      return { req: g.getContext().req };
    }
    return { req: ctx.switchToHttp().getRequest() };
  }
}
