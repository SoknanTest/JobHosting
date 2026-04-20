import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../../generated/prisma/client';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Apply for a job (Seeker only)' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(user.sub, createApplicationDto);
  }

  @Get('mine')
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Get my applications' })
  findMyApplications(@CurrentUser() user: JwtPayload) {
    return this.applicationsService.findMyApplications(user.sub);
  }

  @Get('job/:jobId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get applicants for a job (Employer only)' })
  findJobApplicants(
    @Param('jobId') jobId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.findJobApplicants(jobId, user.sub);
  }

  @Patch(':id/status')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update application status (Employer only)' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, user.sub, updateDto);
  }
}
