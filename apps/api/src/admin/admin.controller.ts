import { Controller, Get, Patch, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban/unban a user' })
  toggleUserBan(@Param('id') id: string, @Body() data: { isBanned: boolean }) {
    return this.adminService.toggleUserBan(id, data.isBanned);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs' })
  findAllJobs() {
    return this.adminService.findAllJobs();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform stats' })
  getStats() {
    return this.adminService.getStats();
  }
}
