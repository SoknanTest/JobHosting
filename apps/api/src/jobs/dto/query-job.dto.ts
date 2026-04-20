import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class QueryJobDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: ['FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERNSHIP'], required: false })
  @IsOptional()
  type?: any;
}
