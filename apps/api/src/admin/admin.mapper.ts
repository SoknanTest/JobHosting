import { StatsResponseDto } from './dto/stats-response.dto';

export class AdminMapper {
  static toStatsDto(stats: {
    users: number;
    jobs: number;
    applications: number;
  }): StatsResponseDto {
    return {
      users: stats.users,
      jobs: stats.jobs,
      applications: stats.applications,
    };
  }
}
