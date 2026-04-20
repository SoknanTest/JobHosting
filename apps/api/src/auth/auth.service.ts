import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role, firstName, lastName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
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

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateGithubUser(profile: any) {
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
