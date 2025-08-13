import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OpenClientModule } from '../open-client/open-client.module';

@Module({
  imports: [PassportModule, JwtModule, OpenClientModule],
  providers: [AuthService, AuthResolver, UsersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
