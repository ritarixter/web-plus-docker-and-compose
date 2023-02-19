import { IsNumber, IsOptional, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => {
      user.offers;
    },
  )
  user: User; //содержит id желающего скинуться;

  @ManyToOne(
    () => Wish,
    (wish) => {
      wish.offers;
    },
  )
  item: Wish; //содержит ссылку на товар;

  @IsNumber()
  @Min(1)
  @Column({
    type: 'decimal',
    scale: 2,
    default: 1,
  })
  amount: number; // — сумма заявки, округляется до двух знаков после запятой;

  @IsOptional()
  @Column({ default: false })
  hidden?: boolean; //— флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false.
}
