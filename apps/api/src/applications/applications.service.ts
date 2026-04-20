import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { jobId, coverNote } = createApplicationDto;

    // Check if already applied
    const existing = await this.prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId,
          seekerId: userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You have already applied for this job');
    }

    return this.prisma.application.create({
      data: {
        coverNote,
        jobId,
        seekerId: userId,
      },
    });
  }

  async findMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { seekerId: userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findJobApplicants(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== userId) {
      throw new ForbiddenException('You are not the owner of this job');
    }

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        seeker: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, userId: string, updateDto: UpdateApplicationStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.job.employerId !== userId) {
      throw new ForbiddenException('You are not the owner of this job');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: updateDto.status },
    });
  }
}
