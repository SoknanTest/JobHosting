import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      include: { profile: true },
    });
  }

  async toggleUserBan(id: string, isBanned: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isBanned },
    });
  }

  async findAllJobs() {
    return this.prisma.job.findMany({
      include: { company: true },
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
