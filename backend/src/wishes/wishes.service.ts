import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
  ) {}
  create(createWishDto: CreateWishDto, req: { user: User }) {
    createWishDto.owner = req.user;
    createWishDto.price = Number(createWishDto.price.toFixed(2));
    return this.wishesRepository.save(createWishDto);
  }

  find(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  update(id: number, updateWishDto: UpdateWishDto, wish: Wish, user: User) {
    if (wish.owner.id != user.id) {
      //Это было реализовано в контроллере
      throw new ForbiddenException('У вас недостаточно прав');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(wish: Wish, user: User) {
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id === user.id) {
      return this.wishesRepository.remove(wish);
    } else {
      throw new ForbiddenException({
        message: 'У вас недостаточно прав',
        status: 403,
      });
    }
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.findOne({ where: { id: wishId } });

    const { name, description, image, link, price, copied } = wish;

    const isExist = !!(await this.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: userId },
      },
      relations: { owner: true },
    }));

    if (isExist) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    const wishCopy = {
      name,
      description,
      image,
      link,
      price,
      owner: { id: userId },
    };

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update<Wish>(Wish, wishId, {
        copied: copied + 1,
      });

      await transactionalEntityManager.insert<Wish>(Wish, wishCopy);
    });

    return {};
  }
}
