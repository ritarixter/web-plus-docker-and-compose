import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: { username: string }) {
    const payload = { sub: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername({
      where: { username },
      select: {
        email: true,
        username: true,
        avatar: true,
        id: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return user;
    } else {
      throw new ForbiddenException({
        message: 'Неверный логин или пароль',
        status: 403,
      });
    }
  }
}
