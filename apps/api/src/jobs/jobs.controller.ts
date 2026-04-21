import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import {
  JobResponseDto,
  PaginatedJobResponseDto,
} from './dto/job-response.dto';
import { JobMapper } from './jobs.mapper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../../generated/prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { ApplicationsService } from '../applications/applications.service';
import { ApplicationResponseDto } from '../applications/dto/application-response.dto';
import { ApplicationMapper } from '../applications/applications.mapper';
import { CreateApplicationDto } from '../applications/dto/create-application.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new job (Employer only)' })
  @ApiResponse({ status: 201, type: JobResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createJobDto: CreateJobDto,
  ): Promise<JobResponseDto> {
    const job = await this.jobsService.create(user.sub, createJobDto);
    return JobMapper.toDto(job);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs (public)' })
  @ApiResponse({ status: 200, type: PaginatedJobResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findAll(@Query() query: QueryJobDto): Promise<PaginatedJobResponseDto> {
    const { data, meta } = await this.jobsService.findAll(query);
    return {
      data: data.map((job) => JobMapper.toDto(job)),
      meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by id' })
  @ApiParam({ name: 'id', description: 'Job CUID' })
  @ApiResponse({ status: 200, type: JobResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findOne(@Param('id') id: string): Promise<JobResponseDto> {
    const job = await this.jobsService.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return JobMapper.toDto(job);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Update job listing' })
  @ApiParam({ name: 'id', description: 'Job CUID' })
  @ApiResponse({ status: 200, type: JobResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<JobResponseDto> {
    const job = await this.jobsService.update(
      id,
      user.sub,
      updateJobDto,
      user.role === Role.ADMIN,
    );
    return JobMapper.toDto(job);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete job listing' })
  @ApiParam({ name: 'id', description: 'Job CUID' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.jobsService.remove(id, user.sub, user.role === Role.ADMIN);
  }

  @Post(':id/apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Apply for a job (Seeker only)' })
  @ApiParam({ name: 'id', description: 'Job CUID' })
  @ApiResponse({ status: 201, type: ApplicationResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async apply(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationResponseDto> {
    const application = await this.applicationsService.create(user.sub, {
      ...createApplicationDto,
      jobId: id,
    });
    return ApplicationMapper.toDto(application);
  }

  @Get(':id/applicants')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get applicants for a job (Employer only)' })
  @ApiParam({ name: 'id', description: 'Job CUID' })
  @ApiResponse({ status: 200, type: [ApplicationResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findJobApplicants(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<ApplicationResponseDto[]> {
    const applications = await this.applicationsService.findJobApplicants(
      id,
      user.sub,
    );
    return applications.map((app) => ApplicationMapper.toDto(app));
  }
}
