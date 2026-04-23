import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { ApplicationMapper } from './applications.mapper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../../generated/prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('mine')
  @Roles(Role.SEEKER)
  @ApiOperation({ summary: 'Get my applications' })
  @ApiResponse({ status: 200, type: [ApplicationResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findMyApplications(
    @CurrentUser() user: JwtPayload,
  ): Promise<ApplicationResponseDto[]> {
    const applications = await this.applicationsService.findMyApplications(
      user.sub,
    );
    return applications.map((app) => ApplicationMapper.toDto(app));
  }

  @Get('employer')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get all applications to my jobs (Employer only)' })
  @ApiResponse({ status: 200, type: [ApplicationResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findEmployerApplications(
    @CurrentUser() user: JwtPayload,
  ): Promise<ApplicationResponseDto[]> {
    const applications = await this.applicationsService.findEmployerApplications(
      user.sub,
    );
    return applications.map((app) => ApplicationMapper.toDto(app));
  }

  @Patch(':id/status')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update application status (Employer only)' })
  @ApiParam({ name: 'id', description: 'Application CUID' })
  @ApiResponse({ status: 200, type: ApplicationResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateDto: UpdateApplicationStatusDto,
  ): Promise<ApplicationResponseDto> {
    const application = await this.applicationsService.updateStatus(
      id,
      user.sub,
      updateDto,
    );
    return ApplicationMapper.toDto(application);
  }
}
