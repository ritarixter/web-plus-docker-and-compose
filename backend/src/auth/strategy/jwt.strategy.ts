import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
const dotenv = require('dotenv')
dotenv.config({path: '.env'})
const {JWT_SECRET} = process.env

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = this.usersService.findOne({
      where: { id: jwtPayload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
