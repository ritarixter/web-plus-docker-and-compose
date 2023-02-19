import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async findUser(@Req() req: User) {
    const user = await this.usersService.findByUsername({
      select: {
        //Реализовано,чтобы только здесь выводился email
        email: true,
        username: true,
        avatar: true,
        id: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { username: req.username },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async findMeWishes(@Req() req: User) {
    const user = await this.usersService.findByUsername({
      relations: {
        wishes: true,
      },
      where: { username: req.username },
    });
    if (!user) {
      throw new NotFoundException({ message: 'ЛОХ' });
    }
    return user.wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername({
      relations: {
        wishes: true,
      },
      where: { username },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user.wishes;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(
    @Req() req: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(req.user, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException({
        message: 'Пользователь с таким именем не найден',
        status: 404,
      });
    }
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findMany(@Body() req) {
    const users = await this.usersService.findMany({
      select: {
        email: true,
        username: true,
        avatar: true,
        id: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
      where: [{ email: req.query }, { username: req.query }],
    });
    if (!users) {
      throw new NotFoundException({
        message: 'Пользователи с таким именем или почтой не найдены',
        status: 404,
      });
    }
    return users;
  }
}
