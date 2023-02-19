import {
  IsString,
  Length,
  IsUrl,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(2)
  @IsString()
  password?: string;
}
