import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from './auth.guard'; // Import the base AuthGuard

@Injectable()
export class AdminGuard extends AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    super.canActivate(context); // Call the base AuthGuard logic
    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().user;

    if (!user.isAdmin) {
      throw new Error('You are not authorized to access this resource.');
    }

    return true;
  }
}
