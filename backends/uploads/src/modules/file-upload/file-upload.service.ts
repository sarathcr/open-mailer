import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { fromBuffer } from 'file-type';
import slugify from 'slugify';
import { encryptData } from '../utils/crypto.util';

@Injectable()
export class FileUploadService {
  private readonly privateUploadPath = path.join(
    process.cwd(),
    'uploads',
    'private',
  );
  private readonly publicUploadPath = path.join(
    process.cwd(),
    'uploads',
    'public',
  );
  private readonly MAX_FILE_NAME_LENGTH = 100;

  constructor() {
    this.ensureUploadDirectories(); // Ensure directories exist at service initialization
  }

  // Ensure private and public directories exist
  private async ensureUploadDirectories() {
    try {
      await fs.promises.mkdir(this.privateUploadPath, { recursive: true });
      await fs.promises.mkdir(this.publicUploadPath, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create upload directories',
      );
    }
  }

  /**
   * Save the file to either the private or public upload path
   * @param file The uploaded file
   * @param userId The ID of the user uploading the file
   * @param isPrivate Whether the file is private or public
   */
  async saveFile(
    file: Express.Multer.File,
    userId: string,
    isPrivate = true,
    appName: string,
  ) {
    try {
      const allowedApps = process.env.ALLOWED_APPS.split(','); // Get allowed apps from the environment variable
      if (!allowedApps.includes(appName)) {
        throw new BadRequestException('Invalid app name'); // If appName is invalid, throw an error
      }
      const uploadPath = isPrivate
        ? this.privateUploadPath
        : this.publicUploadPath;
      const encryptedUserId = encryptData(userId, appName);
      const userFolder = path.join(uploadPath, appName, encryptedUserId);
      const thumbnailFolder = path.join(userFolder, 'thumbnails');

      // Ensure the user-specific folder exists
      await fs.promises.mkdir(userFolder, { recursive: true });
      await fs.promises.mkdir(thumbnailFolder, { recursive: true });

      // Generate a unique filename to avoid overwriting existing files
      const fileExtension = path.extname(file.originalname); // Get file extension
      const sanitizedFileName = slugify(file.originalname, {
        replacement: '-', // Replace special characters with dashes
        lower: true, // Convert to lowercase
      })
        .replace(/[^a-zA-Z0-9\-_.]/g, '_') // Replace non-alphanumeric characters with underscores
        .slice(0, this.MAX_FILE_NAME_LENGTH); // Truncate to max length
      const uniqueFileName = `${path.basename(
        sanitizedFileName,
        fileExtension,
      )}-${Date.now()}${fileExtension}`; // Append timestamp to filename for uniqueness

      // Construct the new file path with the unique file name
      const newFilePath = path.join(userFolder, uniqueFileName);

      // Move the file to the correct folder with the unique name
      await fs.promises.rename(file.path, newFilePath);

      // Detect the actual MIME type using file-type
      const buffer = await fs.promises.readFile(newFilePath);
      const detectedFileType = await fromBuffer(buffer);

      // Default to the provided MIME type if file-type detection fails
      const mimeType = detectedFileType?.mime || file.mimetype;
      console.log(mimeType);

      const fileUrl = isPrivate
        ? `${process.env.PUBLIC_FILES_URL}private/${appName}/${encryptedUserId}/${uniqueFileName}`
        : `${process.env.PUBLIC_FILES_URL}public/${appName}/${encryptedUserId}/${uniqueFileName}`;

      let thumbnailUrl = null;

      // Check if the file is an image (optional based on your requirements)
      if (mimeType.startsWith('image/')) {
        // Generate a thumbnail with sharp
        const thumbnailFileName = `${path.basename(uniqueFileName, fileExtension)}-thumbnail${fileExtension}`;
        const thumbnailFilePath = path.join(thumbnailFolder, thumbnailFileName); // Store thumbnail in a separate folder

        // Create the thumbnail with sharp
        await sharp(newFilePath)
          .resize(150, 150) // Resize to 150x150 (or any desired size)
          .toFile(thumbnailFilePath);

        // Construct the thumbnail URL
        thumbnailUrl = isPrivate
          ? `${process.env.PUBLIC_FILES_URL}private/${appName}/${encryptedUserId}/thumbnails/${thumbnailFileName}`
          : `${process.env.PUBLIC_FILES_URL}public/${appName}/${encryptedUserId}/thumbnails/${thumbnailFileName}`;
      }

      // Get the file stats
      const fileStats = await fs.promises.stat(newFilePath);

      return {
        message: 'File uploaded successfully!',
        details: {
          name: uniqueFileName,
          path: `${appName}/${encryptedUserId}/${uniqueFileName}`,
          type: 'file',
          size: fileStats.size, // File size in bytes
          fileType: file.mimetype, // File MIME type
          lastModified: fileStats.mtime.toISOString(), // Last modified time
          url: fileUrl,
          thumbnail: thumbnailUrl, // Include thumbnail URL (or null if not an image)
        },
      };
    } catch (error) {
      console.error('Error saving file:', error); // Log error for debugging
      throw new InternalServerErrorException(
        `Failed to save file: ${error.message}`,
      );
    }
  }
}
