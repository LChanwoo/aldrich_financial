import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Portfolio } from './Portfolio.entity';
import { Transaction } from './Transaction.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column('decimal',{default: 1000000000, precision: 30, scale: 4 })
  balance!: number;

  @Column('decimal',{default: 1000000000, precision: 30, scale: 4 })
  availableBalance!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios?: Portfolio[];

  get NotTradedTransactions(): Transaction[]  {
    return this.transactions?.filter((transaction) => transaction.doneAt === null);
  }
  get totalInvested(): number {
    return this.portfolios?.reduce((total, portfolio) => +total + (+portfolio.totalInvested || 0), 0) || 0;
  }

  get totalScore(): number {
    return +this.totalInvested + +this.balance;
  }

  toObject(): any {
    return {
      id: this.id,
      email: this.email,
      balance: this.balance,
      availableBalance: this.availableBalance,
      transactions: this.transactions,
      portfolios: this.portfolios,
      totalInvested: this.totalInvested,
      totalScore: this.totalScore,
    };
  }
}
