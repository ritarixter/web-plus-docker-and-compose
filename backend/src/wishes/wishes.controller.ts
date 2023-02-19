import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post('')
  create(@Body() createWishDto: CreateWishDto, @Req() req: { user: User }) {
    return this.wishesService.create(createWishDto, req);
  }

  @Get('last')
  findTop() {
    return this.wishesService.find({
      order: { createdAt: 'ASC' },
      take: 40,
    });
  }

  @Get('top')
  findLast() {
    return this.wishesService.find({
      order: { copied: 'DESC' },
      take: 10,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOne({
      relations: {
        owner: true,
      },
      where: { id },
    });
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ) {
    return this.wishesService.copy(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: User },
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.findOne({
      relations: {
        owner: true,
      },
      where: { id },
    });

    return this.wishesService.update(id, updateWishDto, wish, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ) {
    const wish = await this.wishesService.findOne({
      relations: {
        owner: true,
      },
      where: { id },
    });
    return this.wishesService.remove(wish, req.user);
  }
}
