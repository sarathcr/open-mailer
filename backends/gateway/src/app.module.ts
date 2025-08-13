import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CasClientModule } from './modules/cas-client/cas-client.module';
import { GraphqlModule } from './modules/graphql/graphql.module';

@Module({
  imports: [GraphqlModule, CasClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
