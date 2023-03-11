import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async certification(email:string ,password:string){
    console.log(email,password);
    const user = await this.userRepository.findOneBy({email});
    const isMatch = await bcrypt.compare(password, user.password); 
    if(isMatch){
      return user;
    }else{ 
      return false;
    }

  }
}
