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

}
