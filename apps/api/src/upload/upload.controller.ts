import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  uploadImage(@UploadedFile() file: Express.Multer.File): UploadResponseDto {
    if (!file) throw new BadRequestException('No file uploaded');
    return { url: file.path };
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a PDF' })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  uploadPdf(@UploadedFile() file: Express.Multer.File): UploadResponseDto {
    if (!file) throw new BadRequestException('No file uploaded');
    return { url: file.path };
  }
}
