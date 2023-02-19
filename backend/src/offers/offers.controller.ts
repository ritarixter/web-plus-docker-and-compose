import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: { user: User }) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async update(@Param('id', ParseIntPipe) id: number) {
    const offers = await this.offersService.findOne({
      relations: {
        user: { wishes: true, offers: true },
        item: { owner: true },
      },
      where: { id },
    });
    return offers;
  }
}
