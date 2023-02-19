import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  @Column()
  name: string;

  @IsString()
  @IsUrl()
  @Column()
  link: string;

  @IsString()
  @IsUrl()
  @Column()
  image: string;

  @Min(1)
  @Column({ type: 'decimal', default: 1, scale: 2 })
  price: number;

  @Min(0)
  @IsNumber()
  @Column({ default: 0, scale: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @IsString()
  @Length(1, 1024)
  @Column()
  description: string;

  @OneToMany(
    () => Offer,
    (offer) => {
      offer.item;
    },
  )
  offers: Offer[];

  @Min(0)
  @IsNumber()
  @Column({ default: 0 })
  copied: number;
}
