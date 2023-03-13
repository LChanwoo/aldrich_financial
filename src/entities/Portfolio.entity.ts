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

  @Column('decimal', { precision: 10, scale: 8 })
  quantity?: number;

  @Column()
  averagePrice?: number;

  @Column()
  totalInvested?: number;

  @ManyToOne(() => User, (user) => user.portfolios)
  @JoinColumn({ name: 'user_id' })
  user?: User;


}
