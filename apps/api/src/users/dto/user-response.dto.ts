import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma/client';

export class ProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ type: [String] })
  skills!: string[];

  @ApiProperty({ required: false })
  cvUrl?: string;

  @ApiProperty()
  updatedAt!: Date;
}

export class CompanyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  logo?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty({ required: false })
  location?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty()
  isBanned!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: ProfileResponseDto, required: false })
  profile?: ProfileResponseDto;

  @ApiProperty({ type: CompanyResponseDto, required: false })
  company?: CompanyResponseDto;
}
