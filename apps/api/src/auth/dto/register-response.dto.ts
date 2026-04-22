import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma/client';

class ProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ required: false, nullable: true })
  avatar?: string | null;

  @ApiProperty({ required: false, nullable: true })
  bio?: string | null;

  @ApiProperty({ required: false, nullable: true })
  location?: string | null;

  @ApiProperty({ type: [String] })
  skills!: string[];

  @ApiProperty({ required: false, nullable: true })
  cvUrl?: string | null;

  @ApiProperty({ required: false, nullable: true })
  deletedAt?: Date | null;

  @ApiProperty()
  updatedAt!: Date;
}

export class RegisterResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false, nullable: true })
  githubId?: string | null;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty()
  isBanned!: boolean;

  @ApiProperty({ required: false, nullable: true })
  deletedAt?: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: ProfileDto })
  profile!: ProfileDto;
}
