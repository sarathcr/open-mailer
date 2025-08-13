import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { ApiTokenResolver } from './api-token.resolver';
import { ApiTokenService } from './api-token.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule, AuthModule],
  providers: [ApiTokenResolver, ApiTokenService, JwtStrategy],
  exports: [ApiTokenService],
})
export class ApiTokenModule {}
