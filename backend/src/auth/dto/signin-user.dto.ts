import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  password: string;
}
