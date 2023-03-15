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
  market?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  quantity?: number;

  @Column()
  price?: number;

  @Column()
  totalPrice?: number;

  @Column()
  transactionType?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({default:null})
  doneAt?: Date|null;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  user?: User;

}
