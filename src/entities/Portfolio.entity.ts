import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { Coin } from './Coin.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id?: number;

  @Column()
  market?: string;

  @Column('double', { precision: 30, scale: 8 })
  quantity?: number;

  @Column('double',{default: 0, precision: 30, scale: 8 })
  averagePrice?: number;

  @Column('double',{default: 0, precision: 30, scale: 8 })
  totalInvested?: number;

  @ManyToOne(() => User, (user) => user.portfolios)
  @JoinColumn({ name: 'user_id' })
  user?: User;


}
