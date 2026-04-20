import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  getStorage(folder: string, allowedFormats: string[]) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `job_platform/${folder}`,
        allowed_formats: allowedFormats,
        resource_type: 'auto',
      } as any,
    });
  }
}
