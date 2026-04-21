import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { JobType } from '../../../generated/prisma/client';

export class CreateJobDto {
  @ApiProperty({ example: 'Full Stack Developer' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'We are looking for a developer...' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ enum: JobType, example: JobType.FULL_TIME })
  @IsEnum(JobType)
  type!: JobType;

  @ApiProperty({ example: 'IT & Software' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: 'Phnom Penh' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: 1000, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  salaryMin?: number;

  @ApiProperty({ example: 2000, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  salaryMax?: number;

  @ApiProperty({ example: '2026-12-31T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;
}
