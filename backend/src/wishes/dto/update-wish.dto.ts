import {
  IsString,
  Length,
  IsUrl,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name?: string; //— название подарка. Не может быть длиннее 250 символов и короче одного.

  @IsOptional()
  @IsString()
  @IsUrl()
  link?: string; //— ссылка на интернет-магазин, в котором можно приобрести подарок, строка.

  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string; //ссылка на изображение подарка, строка. Должна быть валидным URL.

  @IsOptional()
  @Min(0)
  @IsNumber()
  price?: number; //— стоимость подарка, с округлением до сотых, число.

  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description?: string; //— строка с описанием подарка длиной от 1 и до 1024 символов.
}
