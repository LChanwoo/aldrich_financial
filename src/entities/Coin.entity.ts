import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './Portfolio.entity';
import { Transaction } from './Transaction.entity';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  market?: string;

  @Column()
  price?: number;

}
