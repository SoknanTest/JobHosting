import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'Phnom Penh', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: ['React', 'NestJS'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ example: 'https://cloudinary.com/cv.pdf', required: false })
  @IsUrl()
  @IsOptional()
  cvUrl?: string;

  @ApiProperty({
    example: 'https://cloudinary.com/avatar.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatar?: string;
}
