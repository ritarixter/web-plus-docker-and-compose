import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: { user: User },
  ) {
    createWishlistDto.owner = req.user;
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findOne({
      relations: {
        owner: true,
        items: true,
      },
      where: { id },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: { user: User },
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: User },
  ) {
    const wishlist = await this.wishlistsService.findOne({
      relations: {
        owner: true,
      },
      where: { id },
    });
    if (wishlist.owner.id === req.user.id) {
      return this.wishlistsService.remove(wishlist);
    } else {
      throw new ForbiddenException({
        message: 'У вас недостаточно прав',
        status: 403,
      });
    }
  }
}
