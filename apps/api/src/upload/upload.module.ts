import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });

        const storage = new CloudinaryStorage({
          cloudinary: cloudinary,
          params: {
            folder: 'job_platform/general',
            allowed_formats: ['jpg', 'png', 'pdf'],
            resource_type: 'auto',
          } as Record<string, unknown>,
        });

        return { storage };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
