import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { AuthModule } from './modules/auth/auth.module';
import { HistoryModule } from './modules/history/history.module';
import { CardsModule } from './modules/cards/cards.module';
import { OpenClientModule } from './modules/open-client/open-client.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    GraphqlModule,
    AuthModule,
    HistoryModule,
    CardsModule,
    OpenClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
