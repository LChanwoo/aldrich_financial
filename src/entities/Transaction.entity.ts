import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { Coin } from './Coin.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id ?: number;

  @Column()
  coin_id?: number;

  @Column()
  quantity?: number;

  @Column()
  totalPrice?: number;

  @Column()
  transactionType?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn({default:null})
  doneAt?: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user?: User;

  @OneToOne(() => Coin, (coin) => coin.transactions)
  @JoinColumn({name: 'coin_id', referencedColumnName: 'id'})
  coin?: Coin;
}
