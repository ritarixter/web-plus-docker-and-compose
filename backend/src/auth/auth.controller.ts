import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() signinUserDto: SigninUserDto) {
    /* Генерируем для пользователя JWT токен */
    return this.authService.auth(signinUserDto);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
