import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { HistoryModule } from '../history/history.module';
import { OpenClientModule } from '../open-client/open-client.module';

@Module({
  imports: [AuthModule, HistoryModule, OpenClientModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
