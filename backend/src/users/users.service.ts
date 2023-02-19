import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = password;
    return this.usersRepository.save(createUserDto);
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  async updateOne(user: User, updateUserDto: UpdateUserDto) {
    //Подскажите, пожалуйста, здесь требуется проверка, если я получаю  юзера из @Req(), который туда попадает из @UseGuards(JwtGuard). То есть тут изменяется пользователь, который авторизован в данный момент.
    if (updateUserDto.username) user.username = updateUserDto.username;

    if (updateUserDto.avatar) user.avatar = updateUserDto.avatar;

    if (updateUserDto.email) user.email = updateUserDto.email;

    if (updateUserDto.about) user.about = updateUserDto.about;

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(updateUserDto.password, salt);
      user.password = password;
    }

    return this.usersRepository.save(user);
  }

  async findByUsername(query: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(query);
    return user;
  }

  async findMany(query: FindManyOptions<User>) {
    const users = this.usersRepository.find(query);
    return users;
  }
}
