import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'), // Serve static files from 'dist/public'
      serveRoot: '/public', // All static files will be accessed under '/public'
      exclude: ['/api*', '/graphql*'], // Exclude API routes
    }),
  ],
})
export class AssetsModule {}
