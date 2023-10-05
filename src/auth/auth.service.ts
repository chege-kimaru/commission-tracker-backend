import {
  Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './model/role.model';
import { User } from './model/user.model';

export enum Provider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) { }

  findUserById(userId: string) {
    return this.userModel.findByPk(userId);
  }

  async validateProviderLogin(profile: any, provider: Provider) {
    try {
      let user = await this.userModel.findOne({
        where: { providerId: profile.id, provider },
      });
      if (!user?.id) {
        user = await this.userModel.create({
          name: `${profile.name?.givenName || profile.displayName || ''} ${profile.name?.familyName || ''}`,
          email: profile.emails?.[0]?.value,
          providerId: profile.id,
          provider,
        });
      }
      return this.login(user);
    } catch (e) {
      throw e;
    }
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      user,
      jwt: this.jwtService.sign(payload),
    };
  }

  getUserRoles(user: User) {
    return user.$get('roles');
  }

  async matchRoles(user: User, roles: Array<string>): Promise<boolean> {
    const userRoles = await this.getUserRoles(user);
    for (const userRole of userRoles) {
      for (const role of roles) {
        if (userRole.name === role) {
          return true;
        }
      }
    }
    return false;
  }

  getUserProfile(userId) {
    return this.userModel.findByPk(userId, {
      include: [{ model: Role }],
    });
  }
}
