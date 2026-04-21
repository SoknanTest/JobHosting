import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../../generated/prisma/client';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'placeholder',
      clientSecret:
        configService.get<string>('GITHUB_CLIENT_SECRET') || 'placeholder',
      callbackURL:
        configService.get<string>('GITHUB_CALLBACK_URL') || 'placeholder',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    return this.authService.validateGithubUser({
      id: profile.id,
      emails: profile.emails || [],
      displayName: profile.displayName,
    });
  }
}
