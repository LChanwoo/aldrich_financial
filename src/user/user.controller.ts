import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { User } from '../common/decorators/user.decorator';
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
  
  @Post('/kill')
  public async killUser(@Body('id') id:number ) {
    return this.userService.killUser(id);
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/givefivemillion')
  @UseGuards(AuthenticatedGuard)
  public async give500millionUser(@User() user: UserDataDto) {
    return this.userService.give500millionUser(user);
  }

  @Get('/userdata')
  @UseGuards(AuthenticatedGuard)
  public async getUserData(@User() user: UserDataDto) {
    return this.userService.getUserData(user);
  }

  @Get('/ranking')
  @UseGuards(AuthenticatedGuard)
  public async getRanking() {
    return this.userService.getRanking();
  }

  @Get('/portfolioChart')
  @UseGuards(AuthenticatedGuard)
  public async getPortfolioChart(@User() user: UserDataDto) {
    return this.userService.getPortfolioChartData(user);
  }

  
}
