import { ApiProperty } from '@nestjs/swagger';

class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ example: 'SEEKER' })
  role!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  access_token!: string;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}
