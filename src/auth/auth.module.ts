import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './model/role.model';
import { UserRole } from './model/user.role.model';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { User } from 'src/auth/model/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Role,
      UserRole,
      User
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        // signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    RolesGuard,
    GoogleStrategy,
    GoogleAuthGuard,
    // FacebookAuthGuard,
    // FacebookStrategy
  ],
  controllers: [AuthController],
  exports: [RolesGuard, JwtAuthGuard, AuthService],
})
export class AuthModule {}
