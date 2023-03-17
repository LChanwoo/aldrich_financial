import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getUsers() {
    return this.userRepository.find();
  }

  public async createUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  public async give500millionUser(user: User) {
    const findUser = await this.userRepository.findOne({ where: { id: user.id } });
    findUser.balance = findUser.balance+500000000;
    findUser.availableBalance = findUser.availableBalance+500000000;
    return this.userRepository.save(findUser);
  }

  public async getUserData(userData: User) {
    const userInfo = await this.userRepository.findOne({
      where: { email: userData.email },
      relations: ['transactions', 'portfolios'],
    });
    if (userInfo) {
      console.log(userInfo.totalInvested); // 모든 포트폴리오의 totalInvested 합산 값
    }
    return userInfo;
  }   
  public async getRanking() {
    const ranking = await this.userRepository.find({relations: ['transactions', 'portfolios'],});
    const sorted = ranking.sort((a, b) => {
      console.log(a.totalScore, b.totalScore)
      if(a.totalScore !== b.totalScore){
        return b.totalScore - a.totalScore;
      }
      if(a.totalInvested !== b.totalInvested){
        return b.totalInvested - a.totalInvested;
      }
      if(a.balance !== b.balance){
        return b.balance - a.balance;
      }
      return 0;
    });
    const map = sorted.map((user, index) => {
      const {password,...removePassword} = user.toObject()
      return removePassword;
    });
    console.log(map)
    return map;
  }
}
