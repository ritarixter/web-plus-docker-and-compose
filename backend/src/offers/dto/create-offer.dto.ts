import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
  user?: User;
}
