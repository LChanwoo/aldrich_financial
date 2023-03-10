import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorators/user.decorator';
import { LocalAuthGuard } from './auth.guard';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('/api/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

    @Post()
    @UseGuards(LocalAuthGuard)
    public async login(@Req() req:any,@User() user: LoginDto) {
      console.log(req.session);
      console.log(user);
    }

}
