import { Prisma } from '../../generated/prisma/client';
import { UserResponseDto, ProfileResponseDto, CompanyResponseDto } from './dto/user-response.dto';

const userInclude = {
  profile: true,
  company: true,
} as const;

export type UserWithRelations = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export { userInclude };

export class UserMapper {
  static toDto(user: UserWithRelations): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBanned: user.isBanned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile ? UserMapper.toProfileDto(user.profile) : undefined,
      company: user.company ? UserMapper.toCompanyDto(user.company) : undefined,
    };
  }

  static toProfileDto(profile: Prisma.ProfileGetPayload<any>): ProfileResponseDto {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar ?? undefined,
      bio: profile.bio ?? undefined,
      location: profile.location ?? undefined,
      skills: profile.skills,
      cvUrl: profile.cvUrl ?? undefined,
      updatedAt: profile.updatedAt,
    };
  }

  static toCompanyDto(company: Prisma.CompanyGetPayload<any>): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      logo: company.logo ?? undefined,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      location: company.location ?? undefined,
    };
  }
}
