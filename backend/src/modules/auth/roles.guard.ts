// src/auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private clientId = process.env.KEYCLOAK_CLIENT_ID || 'OpenMailer';
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const req =
      context.getType<'graphql'>() === 'graphql'
        ? GqlExecutionContext.create(context).getContext().req
        : context.switchToHttp().getRequest();

    const user = (req as any)?.user ?? {};
    const clientRoles = user?.resource_access?.[this.clientId]?.roles ?? [];
    const realmRoles = user?.realm_access?.roles ?? [];
    const flat = new Set([...clientRoles, ...realmRoles]);

    const ok = required.some((r) => flat.has(r));
    if (!ok) throw new ForbiddenException('Access denied');
    return true;
  }
}
