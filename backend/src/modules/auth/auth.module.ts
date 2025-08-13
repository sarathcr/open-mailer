// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { KongJwtGuard } from './guard/kong-jwt.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [KongJwtGuard, RolesGuard],
  exports: [KongJwtGuard, RolesGuard],
})
export class AuthModule {}
