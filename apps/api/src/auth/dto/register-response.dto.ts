import { ApiProperty } from '@nestjs/swagger';

class ProfileDto {
  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ example: 'SEEKER' })
  role!: string;

  @ApiProperty({ type: ProfileDto })
  profile!: ProfileDto;
}
