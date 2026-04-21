import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '../../../generated/prisma/client';

export class CompanyJobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  logo?: string;
}

export class JobResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: JobType })
  type!: JobType;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  location!: string;

  @ApiProperty({ required: false })
  salaryMin?: number;

  @ApiProperty({ required: false })
  salaryMax?: number;

  @ApiProperty({ required: false })
  deadline?: Date;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: CompanyJobResponseDto, required: false })
  company?: CompanyJobResponseDto;
}

export class PaginatedJobResponseDto {
  @ApiProperty({ type: [JobResponseDto] })
  data!: JobResponseDto[];

  @ApiProperty()
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
