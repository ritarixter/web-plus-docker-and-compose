import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  @Column()
  name: string; //— название списка.  Не может быть длиннее 250 символов и короче одного;

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  @Column({ default: '' })
  description?: string; //— описание подборки, строка до 1500 символов;

  @IsUrl()
  @Column()
  image: string; //— обложка для подборки;

  @ManyToMany(() => Wish, () => Wish)
  @JoinTable()
  items: Wish[]; //содержит набор ссылок на подарки.

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
