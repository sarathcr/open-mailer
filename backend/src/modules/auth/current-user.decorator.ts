// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { KeycloakAccessToken } from './kong-claims';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    let user: KeycloakAccessToken | undefined;
    if (ctx.getType<'graphql'>() === 'graphql') {
      const g = GqlExecutionContext.create(ctx);
      user = (g.getContext().req as any)?.user;
    } else {
      user = (ctx.switchToHttp().getRequest() as any)?.user;
    }
    return data ? (user as any)?.[data] : user;
  },
);
