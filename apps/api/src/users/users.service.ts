import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { userInclude, UserWithRelations } from './users.mapper';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: string): Promise<UserWithRelations> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: userInclude,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }
}
