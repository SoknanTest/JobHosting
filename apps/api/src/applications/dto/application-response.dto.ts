import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../generated/prisma/client';
import { JobResponseDto } from '../../jobs/dto/job-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ApplicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ApplicationStatus })
  status!: ApplicationStatus;

  @ApiProperty({ required: false })
  coverNote?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  jobId!: string;

  @ApiProperty({ type: JobResponseDto, required: false })
  job?: JobResponseDto;

  @ApiProperty()
  seekerId!: string;

  @ApiProperty({ type: UserResponseDto, required: false })
  seeker?: UserResponseDto;
}
