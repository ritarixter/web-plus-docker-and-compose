import {
  IsString,
  Length,
  IsEmail,
  IsUrl,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  @Column({
    unique: true,
  })
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  @Column({ default: 'Пока ничего не рассказал о себе' })
  about?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar?: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Column({ unique: true, select: false })
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes?: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers?: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists?: Wishlist[];
}
