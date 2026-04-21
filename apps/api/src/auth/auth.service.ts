import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../../generated/prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.SEEKER, // Always default to SEEKER
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User, response: Response) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign({ ...payload });
    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'refresh-secret',
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ||
          '7d') as any,
      },
    );

    // Set refresh token in httpOnly cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  logout(response: Response) {
    response.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  async refresh(user: User, response: Response) {
    return this.login(user, response);
  }

  verifyEmail(_token: string) {
    // Placeholder for email verification logic
    return { message: 'Email verified successfully' };
  }

  async validateGithubUser(profile: {
    id: string;
    emails: { value: string }[];
    displayName?: string;
  }) {
    const { id, emails, displayName } = profile;
    const email = emails[0].value;

    let user = await this.prisma.user.findUnique({ where: { githubId: id } });

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        // Link GitHub to existing user
        user = await this.prisma.user.update({
          where: { email },
          data: { githubId: id },
        });
      } else {
        // Create new user
        const names = (displayName || '').split(' ');
        const firstName = names[0] || 'GitHub';
        const lastName = names.slice(1).join(' ') || 'User';

        user = await this.prisma.user.create({
          data: {
            email,
            githubId: id,
            role: Role.SEEKER,
            isVerified: true,
            profile: {
              create: {
                firstName,
                lastName,
              },
            },
          },
        });
      }
    }

    return user;
  }
}
