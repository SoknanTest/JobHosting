import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../../generated/prisma/client';
import type { RequestWithUser } from './interfaces/jwt-payload.interface';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user as User);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  refresh(@Req() req: RequestWithUser) {
    return this.authService.refresh(req.user as User);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout() {
    return this.authService.logout();
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'Login with GitHub' })
  githubAuth() {
    // Redirects to GitHub
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  githubAuthCallback(@Req() req: RequestWithUser) {
    return this.authService.login(req.user as User);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
