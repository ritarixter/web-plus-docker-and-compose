import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string; //— название подарка. Не может быть длиннее 250 символов и короче одного.

  @IsString()
  @IsUrl()
  link: string; //— ссылка на интернет-магазин, в котором можно приобрести подарок, строка.

  @IsString()
  @IsUrl()
  image: string; //ссылка на изображение подарка, строка. Должна быть валидным URL.

  @Min(0)
  @IsNumber()
  price: number; //— стоимость подарка, с округлением до сотых, число.

  @IsString()
  @Length(1, 1024)
  description: string; //— строка с описанием подарка длиной от 1 и до 1024 символов.

  owner: User;
}
