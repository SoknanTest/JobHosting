import { Prisma } from '../../generated/prisma/client';
import { JobResponseDto } from './dto/job-response.dto';

const jobInclude = {
  company: {
    select: { id: true, name: true, logo: true },
  },
} as const;

export type JobWithRelations = Prisma.JobGetPayload<{
  include: typeof jobInclude;
}>;

export { jobInclude };

export class JobMapper {
  static toDto(job: JobWithRelations): JobResponseDto {
    return {
      id: job.id,
      title: job.title,
      description: job.description,
      type: job.type,
      category: job.category,
      location: job.location,
      salaryMin: job.salaryMin ?? undefined,
      salaryMax: job.salaryMax ?? undefined,
      deadline: job.deadline ?? undefined,
      isActive: job.isActive,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      company: job.company
        ? {
            id: job.company.id,
            name: job.company.name,
            logo: job.company.logo ?? undefined,
          }
        : undefined,
    };
  }
}
