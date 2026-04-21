import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JobResponseDto } from '../jobs/dto/job-response.dto';
import { StatsResponseDto } from './dto/stats-response.dto';
import { UserMapper } from '../users/users.mapper';
import { JobMapper } from '../jobs/jobs.mapper';
import { AdminMapper } from './admin.mapper';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { JobsService } from '../jobs/jobs.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jobsService: JobsService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.adminService.findAllUsers();
    return users.map((u) => UserMapper.toDto(u));
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban/unban a user' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async toggleUserBan(
    @Param('id') id: string,
    @Body() data: { isBanned: boolean },
  ): Promise<UserResponseDto> {
    const user = await this.adminService.toggleUserBan(id, data.isBanned);
    return UserMapper.toDto(user);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<UserResponseDto> {
    const user = await this.adminService.updateUserRole(id, updateRoleDto.role);
    return UserMapper.toDto(user);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, type: [JobResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findAllJobs(): Promise<JobResponseDto[]> {
    const jobs = await this.adminService.findAllJobs();
    return jobs.map((j) => JobMapper.toDto(j));
  }

  @Delete('jobs/:id')
  @ApiOperation({ summary: 'Delete a job listing' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async removeJob(@Param('id') id: string): Promise<void> {
    await this.jobsService.remove(id, '', true); // userId empty string because isAdmin is true
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform stats' })
  @ApiResponse({ status: 200, type: StatsResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async getStats(): Promise<StatsResponseDto> {
    const stats = await this.adminService.getStats();
    return AdminMapper.toStatsDto(stats);
  }
}
