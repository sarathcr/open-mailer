import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [FileUploadModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
