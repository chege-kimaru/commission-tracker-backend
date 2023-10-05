import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService, Provider } from '../auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK'),
      passReqToCallback: true,
      scope: ['openid', 'profile', 'email'],
    });
  }


  async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
    try {
      const user = await this.authService.validateProviderLogin(profile, Provider.GOOGLE);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }

}
