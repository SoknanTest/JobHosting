import { Prisma } from '../../generated/prisma/client';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { JobMapper, jobInclude } from '../jobs/jobs.mapper';
import { UserMapper, userInclude } from '../users/users.mapper';

const applicationInclude = {
  job: {
    include: jobInclude,
  },
  seeker: {
    include: userInclude,
  },
} as const;

export type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
  include: typeof applicationInclude;
}>;

export { applicationInclude };

export class ApplicationMapper {
  static toDto(application: ApplicationWithRelations): ApplicationResponseDto {
    return {
      id: application.id,
      status: application.status,
      coverNote: application.coverNote ?? undefined,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      jobId: application.jobId,
      job: application.job ? JobMapper.toDto(application.job) : undefined,
      seekerId: application.seekerId,
      seeker: application.seeker
        ? UserMapper.toDto(application.seeker)
        : undefined,
    };
  }
}
