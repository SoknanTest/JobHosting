import { Prisma } from '../../generated/prisma/client';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserMapper } from '../users/users.mapper';

export const authInclude = {
  profile: true,
  company: true,
} as const;

export type AuthUserWithRelations = Prisma.UserGetPayload<{
  include: typeof authInclude;
}>;

export class AuthMapper {
  static toUserDto(user: AuthUserWithRelations): UserResponseDto {
    return UserMapper.toDto(user);
  }

  static toAuthResponseDto(user: AuthUserWithRelations, accessToken: string): AuthResponseDto {
    return {
      access_token: accessToken,
      user: this.toUserDto(user),
    };
  }
}
