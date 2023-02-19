import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, userId) {
    createOfferDto.amount = Number(createOfferDto.amount.toFixed(2));
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });

    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'Вы не можете вносить деньги на собственные подарки',
      );
    }

    if (createOfferDto.amount + wish.raised > wish.price) {
      throw new ForbiddenException(
        'Сумма взноса превышает сумму остатка стоимости подарка',
      );
    }

    const offer = await this.offerRepository.save({
      ...createOfferDto,
      user: { id: userId },
      item: { id: createOfferDto.itemId },
    });

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.insert<Offer>(Offer, offer);
      await transactionalEntityManager.update<Wish>(
        Wish,
        createOfferDto.itemId,
        {
          raised: Number(wish.raised + createOfferDto.amount),
        },
      );
    });
    return offer;
  }

  findAll() {
    return this.offerRepository.find();
  }

  findOne(query: FindOneOptions<Offer>) {
    return this.offerRepository.findOne(query);
  }
}
