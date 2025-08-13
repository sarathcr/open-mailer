import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import { createReadStream } from 'fs';
import { existsSync } from 'fs';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import { decryptData } from '../utils/crypto.util';

@Injectable()
export class FilesService {
  private readonly uploadPath = process.env.UPLOAD_DIR;

  /**
   * Serve a file from a given file path
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

  /**
   * Get a private file
   */
  getPrivateFile(
    appName: string,
    userId: string,
    filename: string,
    res: Response,
  ) {
    const filePath = join(
      this.uploadPath + '/private',
      appName,
      userId,
      filename,
    );
    this.serveFile(filePath, res);
  }

  /**
   * Get a public file
   */
  getPublicFile(
    appName: string,
    userId: string,
    filename: string,
    res: Response,
  ) {
    const filePath = join(
      this.uploadPath + '/public',
      appName,
      userId,
      filename,
    );
    this.serveFile(filePath, res);
  }

  /**
   * Get a public thumbnail
   */
  getPublicThumbnail(
    appName: string,
    userId: string,
    filename: string,
    res: Response,
  ) {
    const thumbnailPath = join(
      this.uploadPath + '/public',
      appName,
      userId,
      'thumbnails',
      filename,
    );
    this.serveFile(thumbnailPath, res);
  }

  /**
   * Get a private thumbnail
   */
  getPrivateThumbnail(
    appName: string,
    userId: string,
    filename: string,
    res: Response,
  ) {
    const thumbnailPath = join(
      this.uploadPath + '/private',
      appName,
      userId,
      'thumbnails',
      filename,
    );
    this.serveFile(thumbnailPath, res);
  }

  async getFiles(
    pathType: 'public' | 'private' | null,
    folderPath: string,
    page = 1,
    limit = 10,
    sortField = 'name',
    sortOrder = 'asc',
    fileType: string | null,
    nameFilter: string | null = null,
    userId: string | null,
    appName: string | null,
  ) {
    const basePaths = pathType
      ? [path.join(this.uploadPath, pathType)]
      : [
          path.join(this.uploadPath, 'private'),
          path.join(this.uploadPath, 'public'),
        ];

    const results = [];
    try {
      for (const basePath of basePaths) {
        const fullPath = path.join(basePath, appName || folderPath);

        if (!fs.existsSync(fullPath)) {
          continue; // Skip non-existent folders
        }

        // Helper to read files recursively
        const readFilesRecursively = async (
          dirPath: string,
        ): Promise<{ mainFiles: any[]; thumbnails: any[] }> => {
          const dirents = await fs.promises.readdir(dirPath, {
            withFileTypes: true,
          });
          let mainFiles: any[] = [];
          let thumbnails: any[] = [];

          for (const dirent of dirents) {
            const filePath = path.join(dirPath, dirent.name);
            if (dirent.isDirectory()) {
              if (dirent.name === 'thumbnails') {
                const thumbnailFiles = await readFilesRecursively(filePath);
                thumbnails = thumbnails.concat(thumbnailFiles.mainFiles);
              } else {
                const nestedFiles = await readFilesRecursively(filePath);
                mainFiles = mainFiles.concat(nestedFiles.mainFiles);
                thumbnails = thumbnails.concat(nestedFiles.thumbnails);
              }
            } else {
              const stats = await fs.promises.stat(filePath);
              const relativePath = path
                .relative(basePath, filePath)
                .replace(/\\/g, '/');
              const pathSegments = relativePath.split('/');
              const fileAppName = pathSegments[0];
              const fileUserId = pathSegments[1];

              const decryptedUserId = decryptData(fileUserId, fileAppName);
              const inferredPathType = basePath.includes('private')
                ? 'private'
                : 'public';
              mainFiles.push({
                name: dirent.name,
                path: relativePath,
                type: 'file',
                size: stats.size,
                fileType: getFileType(dirent.name),
                lastModified: stats.mtime.toISOString(),
                url: `${process.env.PUBLIC_FILES_URL}${inferredPathType}/${relativePath}`, // basePath is missing here
                appName: fileAppName,
                userId: decryptedUserId,
                isPrivate: basePath.includes('private'),
              });
            }
          }
          return { mainFiles, thumbnails };
        };

        // Collect all files
        const { mainFiles, thumbnails } = await readFilesRecursively(fullPath);

        // Merge files with their thumbnails
        const filesWithThumbnails = mainFiles.map((file) => {
          const baseName = file.name.replace(path.extname(file.name), '');
          const matchingThumbnail = thumbnails.find((thumb) =>
            thumb.name.startsWith(baseName),
          );
          return {
            ...file,
            thumbnail: matchingThumbnail ? matchingThumbnail.url : null,
          };
        });

        results.push(...filesWithThumbnails);
      }

      // Apply filters
      let filteredFiles = results;

      if (fileType) {
        filteredFiles = filteredFiles.filter((file) => {
          const mimeType = mime.lookup(file.path) || '';
          return mimeType.includes(fileType);
        });
      }

      if (nameFilter) {
        filteredFiles = filteredFiles.filter((file) =>
          file.name.toLowerCase().includes(nameFilter.toLowerCase()),
        );
      }

      if (userId) {
        filteredFiles = filteredFiles.filter(
          (file) => file.userId === decryptData(userId, file.appName),
        );
      }

      // Sort files
      if (sortField) {
        filteredFiles.sort((a, b) => {
          const valueA =
            typeof a[sortField] === 'string'
              ? a[sortField].toLowerCase()
              : a[sortField];
          const valueB =
            typeof b[sortField] === 'string'
              ? b[sortField].toLowerCase()
              : b[sortField];

          if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
          if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Pagination
      const totalFiles = filteredFiles.length;
      const totalPages = Math.ceil(totalFiles / limit);
      const startIndex = (page - 1) * limit;
      const paginatedFiles = filteredFiles.slice(
        startIndex,
        startIndex + limit,
      );

      return {
        currentPage: page,
        totalPages,
        totalFiles,
        pageSize: paginatedFiles.length,
        files: paginatedFiles,
      };
    } catch (error) {
      console.error('Error retrieving files:', error);
      throw new InternalServerErrorException('Error retrieving files.');
    }
  }

  async deleteFile(
    appName: string,
    userId: string,
    fileName: string,
    pathType: string,
  ): Promise<{ message: string; filePath: string; thumbnailDeleted: boolean }> {
    const allowedApps = process.env.ALLOWED_APPS.split(',');

    // Validate appName
    if (!allowedApps.includes(appName) || !userId || !fileName) {
      throw new BadRequestException('Invalid app name');
    }

    // Construct full file path
    const fullPath = path.join(
      this.uploadPath,
      pathType,
      appName,
      userId,
      fileName,
    );
    // Construct thumbnail path
    const fileExtension = path.extname(fileName);
    const fileNameWithoutExt = path.basename(fileName, fileExtension);
    const thumbnailPath = path.join(
      this.uploadPath,
      pathType,
      appName,
      userId,
      'thumbnails',
      `${fileNameWithoutExt}-thumbnail${fileExtension}`,
    );
    let thumbnailDeleted = false;

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    // Delete the file
    try {
      await fs.promises.unlink(fullPath);
      // Attempt to delete the thumbnail
      try {
        await fs.promises.stat(thumbnailPath); // Check if thumbnail exists
        await fs.promises.unlink(thumbnailPath); // Delete the thumbnail
        thumbnailDeleted = true;
      } catch {
        // If thumbnail doesn't exist, log a warning and proceed
        console.warn(`Thumbnail not found: ${thumbnailPath}`);
      }
      return {
        message: 'File deleted successfully',
        filePath: fullPath,
        thumbnailDeleted,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
      throw new InternalServerErrorException(
        `Error deleting file: ${error.message}`,
      );
    }
  }
}

function getFileType(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm', // Added webm
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg', // Added ogg
    '.flac': 'audio/flac', // Added flac
    '.json': 'application/json',
    '.zip': 'application/zip', // Added zip
    '.tar': 'application/x-tar', // Added tar
    '.csv': 'text/csv', // Added csv
    '.xml': 'application/xml', // Added xml
    '.html': 'text/html', // Added html
    '.css': 'text/css', // Added css
    '.js': 'application/javascript', // Added js
    '.yaml': 'application/x-yaml', // Added yaml
    '.yml': 'application/x-yaml', // Added yml
  };

  return mimeTypes[extension] || 'application/octet-stream'; // Default to generic MIME type if not found
}
