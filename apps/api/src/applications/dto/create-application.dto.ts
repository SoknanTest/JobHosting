import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 'I am very interested in this position...' })
  @IsString()
  @IsOptional()
  coverNote?: string;

  @ApiProperty({ example: 'job-id-123' })
  @IsString()
  @IsNotEmpty()
  jobId: string;
}
