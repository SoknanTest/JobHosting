import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../generated/prisma/client';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new job (Employer only)' })
  create(@CurrentUser() user: any, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(user.id, createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs (public)' })
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by id' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Update job listing' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, user.id, updateJobDto, user.role === Role.ADMIN);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete job listing' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.jobsService.remove(id, user.id, user.role === Role.ADMIN);
  }
}
