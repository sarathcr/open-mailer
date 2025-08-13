import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  // UseGuards,
  InternalServerErrorException,
  Query,
  Request,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { createReadStream } from 'fs';
// import { AuthGuard } from '../common/guard/auth.guard';
import { FilesService } from './files.service';
// import { AdminGuard } from '../common/guard/admin.guard';

@Controller('files')
export class FilesController {
  private readonly privateUploadPath = process.env.UPLOAD_DIR + '/private';
  private readonly publicUploadPath = process.env.UPLOAD_DIR + '/public';
  constructor(private readonly filesService: FilesService) {}

  /**
   * Utility function to serve files
   */
  private serveFile(filePath: string, res: Response) {
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const fileStream = createReadStream(filePath);
    fileStream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ message: 'File not found' });
      }
    });

    fileStream.pipe(res);
  }

  @Get('getFiles')
  // @UseGuards(AdminGuard)
  async getFiles(
    @Request() req,
    @Query('accessType') pathType: 'public' | 'private',
    @Query('folderPath') folderPath: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortField')
    sortField: 'name' | 'size' | 'fileType' | 'lastModified' = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('fileType') fileType: string | null = null,
    @Query('search') nameFilter: string | null = null,
    @Query('userId') userId: string | null = null,
    @Query('appName') appName: string | null = null,
  ) {
    try {
      const files = await this.filesService.getFiles(
        pathType,
        folderPath,
        Number(page),
        Number(limit),
        sortField,
        sortOrder,
        fileType,
        nameFilter,
        userId,
        appName,
      );
      return {
        message: 'Files retrieved successfully',
        data: files,
      };
    } catch (error) {
      console.error('Error retrieving files:', error);
      throw new InternalServerErrorException('Error retrieving files.');
    }
  }

  /**
   * Serve Private Files (Auth required)
   */
  @Get('private/:appName/:userId/:filename')
  // @UseGuards(AuthGuard)
  async getPrivateFile(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(this.privateUploadPath, appName, userId, filename);
    this.serveFile(filePath, res);
  }

  /**
   * Serve Public Files (No Auth)
   */
  @Get('public/:appName/:userId/:filename')
  async getPublicFile(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(this.publicUploadPath, appName, userId, filename);
    this.serveFile(filePath, res);
  }

  /**
   * Serve Thumbnail Files (Public or Private based on folder structure)
   */
  @Get('public/:appName/:userId/thumbnails/:filename')
  async getThumbnail(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const thumbnailPath = join(
      this.publicUploadPath,
      appName,
      userId,
      'thumbnails',
      filename,
    );
    this.serveFile(thumbnailPath, res);
  }

  @Get('private/:appName/:userId/thumbnails/:filename')
  // @UseGuards(AuthGuard)
  async getPrivateThumbnail(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const thumbnailPath = join(
      this.privateUploadPath,
      appName,
      userId,
      'thumbnails',
      filename,
    );
    this.serveFile(thumbnailPath, res);
  }

  @Delete('/:pathType/:appName/:userId/:fileName')
  // @UseGuards(AuthGuard)
  async deleteFile(
    @Param('pathType') pathType: string,
    @Param('appName') appName: string,
    @Param('userId') userId: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const result = await this.filesService.deleteFile(
        appName,
        userId,
        fileName,
        pathType,
      );
      return result;
    } catch (error) {
      console.error('Error deleting file:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
