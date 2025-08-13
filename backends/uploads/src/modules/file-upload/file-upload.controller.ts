import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { AuthGuard } from '../common/guard/auth.guard';
import { encryptData } from '../utils/crypto.util';

interface CustomRequest extends Request {
  user?: User;
}
interface User {
  id: string;
}
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  /**
   * Upload a file with the option to specify private or public upload.
   * The `isPrivate` parameter decides if the file goes to the "private" or "public" directory.
   *
   * @param file The file being uploaded
   * @param req The request object (user information can be retrieved from here)
   */

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const appName = req.body.appName;
          const userId = (req as unknown as CustomRequest).user?.id || 'guest';
          const encryptedUserId = encryptData(userId, appName);
          const isPrivate = req.body.isPrivate === 'true';
          const allowedApps = process.env.ALLOWED_APPS?.split(',');

          // Validate if the appName is in the allowed apps list
          if (!allowedApps.includes(appName)) {
            throw new BadRequestException('Invalid app name');
          }

          if (!appName || !encryptedUserId) {
            return cb(
              new BadRequestException('Invalid appName or userId'),
              null,
            );
          }

          // Directly set the final destination folder instead of temp
          const baseFolder = isPrivate ? 'private' : 'public';
          const finalUploadPath = path.join(
            process.cwd(),
            'uploads',
            baseFolder,
            appName,
            encryptedUserId,
          );
          if (!fs.existsSync(finalUploadPath)) {
            fs.mkdirSync(finalUploadPath, { recursive: true });
          }
          cb(null, finalUploadPath); // Directly store in the final folder
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9); // Generate unique suffix based on timestamp and random number
          const extension = path.extname(file.originalname); // Get file extension
          const filename = `${file.fieldname}-${uniqueSuffix}${extension}`; // Append unique suffix to the original filename
          cb(null, filename); // Set the final file name
        },
      }),
    }),
  )
  @UseGuards(AuthGuard)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body('isPrivate') isPrivate: string,
    @Body('appName') appName: string,
  ) {
    const isPrivateBoolean = isPrivate === 'true';
    const userId = req.user?.id || 'guest'; // Assume "guest" if user is not available
    const result = await this.fileUploadService.saveFile(
      file,
      userId,
      isPrivateBoolean,
      appName,
    );
    return result;
  }
}
