import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}
  create(createWishlistDto: CreateWishlistDto) {
    const items = createWishlistDto.itemsId.map((id) => ({ id }));
    const wishList = this.wishlistRepository.save({
      ...createWishlistDto,
      items,
    });
    return wishList;
  }

  findAll(query: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.findOne(query);
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }

    if (updateWishlistDto.name) wishlist.name = updateWishlistDto.name;

    if (updateWishlistDto.image) wishlist.image = updateWishlistDto.image;

    if (updateWishlistDto.description)
      wishlist.description = updateWishlistDto.description;

    if (updateWishlistDto.itemsId) {
      const items = updateWishlistDto.itemsId.map((id) => ({ id }));
      ({
        ...wishlist,
        items,
      });
    }

    return this.wishlistRepository.save(wishlist);
  }

  async remove(query: Wishlist) {
    return this.wishlistRepository.remove(query);
  }
}
