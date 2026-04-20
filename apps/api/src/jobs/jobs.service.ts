import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';

import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createJobDto: CreateJobDto) {
    const company = await this.prisma.company.findUnique({ where: { userId } });
    
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        employerId: userId,
        companyId: company?.id,
      },
    });
  }

  async findAll(query: QueryJobDto) {
    const { page = 1, limit = 10, search, category, location, type } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = { isActive: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (location) where.location = location;
    if (type) where.type = type;

    const [total, data] = await Promise.all([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: true,
          employer: {
            select: {
              profile: true,
            },
          },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        employer: {
          select: {
            profile: true,
          },
        },
      },
    });

    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, userId: string, updateJobDto: UpdateJobDto, isAdmin = false) {
    const job = await this.findOne(id);
    
    if (!isAdmin && job.employerId !== userId) {
      throw new ForbiddenException('You are not the owner of this job');
    }

    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: string, userId: string, isAdmin = false) {
    const job = await this.findOne(id);
    
    if (!isAdmin && job.employerId !== userId) {
      throw new ForbiddenException('You are not the owner of this job');
    }

    return this.prisma.job.delete({ where: { id } });
  }
}
