import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsOptional()
  @Length(2, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  password: string;
}
