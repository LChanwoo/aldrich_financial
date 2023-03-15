import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDataDto } from './dto/userData.dto';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  public async getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
