import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UserResponseDto, ProfileResponseDto } from './dto/user-response.dto';
import { UserMapper } from './users.mapper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async findMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    const userData = await this.usersService.findMe(user.sub);
    return UserMapper.toDto(userData);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.usersService.updateProfile(
      user.sub,
      updateProfileDto,
    );
    return UserMapper.toProfileDto(profile);
  }

  @Patch('me/avatar')
  @ApiOperation({ summary: 'Update current user avatar' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateAvatar(
    @CurrentUser() user: JwtPayload,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.usersService.updateAvatar(
      user.sub,
      updateFileDto.url,
    );
    return UserMapper.toProfileDto(profile);
  }

  @Patch('me/cv')
  @ApiOperation({ summary: 'Update current user CV' })
  @ApiResponse({ status: 200, type: ProfileResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async updateCv(
    @CurrentUser() user: JwtPayload,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.usersService.updateCv(
      user.sub,
      updateFileDto.url,
    );
    return UserMapper.toProfileDto(profile);
  }
}
