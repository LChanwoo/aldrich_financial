import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Portfolio } from './Portfolio.entity';
import { Transaction } from './Transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({default: 1000000})
  balance!: number;

  @Column({default: 1000000})
  availableBalance!: number;


  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios?: Portfolio[];

}
