// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req =
      ctx.getType<'graphql'>() === 'graphql'
        ? GqlExecutionContext.create(ctx).getContext().req
        : ctx.switchToHttp().getRequest();
    const user = (req as any)?.user;
    return data ? user?.[data] : user;
  },
);
