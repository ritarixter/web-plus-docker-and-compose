import { IsString, Length, IsUrl, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string; //— название списка.  Не может быть длиннее 250 символов и короче одного;

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description?: string; //— описание подборки, строка до 1500 символов;

  @IsUrl()
  image: string; //— обложка для подборки;

  itemsId: number[]; //number[]?содержит набор ссылок на подарки.

  owner?: User;
}
