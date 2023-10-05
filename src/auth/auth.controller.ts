import {
  Controller,
  Request,
  UseGuards,
  Get,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { UtilsService } from 'src/shared/utils.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Sign in with google' })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req, @Res() res) {
    try {
      if (req.user) {
        this.generateAUthCookie(req, res, req.user.jwt);
        res.redirect(
          `${this.configService.get('CLIENT_AUTH_REDIRECT')}&status=success`,
        );
      } else {
        res.redirect(
          `${this.configService.get('CLIENT_AUTH_REDIRECT')}&status=failed`,
        );
      }
    } catch (e) {
      throw e;
    }
  }

  @HttpCode(204)
  @Get('logout')
  async logout(@Request() req: any, @Res() res) {
    this.generateAUthCookie(req, res, '', true);
    res.status(200).json({});
  }

  private generateAUthCookie(
    req: any,
    res: any,
    jwt: string,
    isLogout = false,
  ) {
    res.cookie('_secure_id', jwt, {
      signed: true,
      httpOnly: true,
      secure: !UtilsService.isLocalhost(req),
      maxAge: isLogout
        ? 0
        : this.configService.get<number>('JWT_EXPIRATION_TIME'), //5 days
      // TODO: RESERCH MORE ON THIS
      sameSite: UtilsService.isLocalhost(req) ? 'lax' : 'none',
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.id);
  }

}
