import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma/client';
import { jobInclude } from '../jobs/jobs.mapper';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      include: { profile: true, company: true },
    });
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, company: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async toggleUserBan(id: string, isBanned: boolean) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isBanned },
      include: { profile: true, company: true },
    });
  }

  async updateUserRole(id: string, role: Role) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      include: { profile: true, company: true },
    });
  }

  async findAllJobs() {
    return this.prisma.job.findMany({
      include: jobInclude,
    });
  }

  async getStats() {
    const [users, jobs, applications] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.job.count(),
      this.prisma.application.count(),
    ]);

    return { users, jobs, applications };
  }
}
