import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './User.entity';
@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id?: number;

  @Column()
  market?: string;

  @Column('decimal', { precision: 30, scale: 8 })
  quantity?: number;

  @Column('decimal',{default: 0, precision: 30, scale: 4 })
  averagePrice?: number;

  @Column('decimal',{default: 0, precision: 30, scale: 4 })
  totalInvested?: number;

  @ManyToOne(() => User, (user) => user.portfolios)
  @JoinColumn({ name: 'user_id' })
  user?: User;


}
