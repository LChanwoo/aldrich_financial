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
  coin_id?: number;

  @Column()
  quantity?: number;

  @ManyToOne(() => User, (user) => user.portfolios)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToOne(() => Coin, (coin) => coin.portfolios)
  @JoinColumn({ name: 'coin_id' })
  coin?: Coin;

}
