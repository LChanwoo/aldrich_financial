import { Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../common/decorators/user.decorator';
import { LocalAuthGuard } from './auth.guard';

import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { LoginDto } from './dto/login.dto';

@Controller('/api/auth')
export class AuthController {
    private logger = new Logger('AuthController');
  constructor(
    private readonly authService: AuthService,
  ) {}

    @Post()
    @UseGuards(LocalAuthGuard)
    public async login(@User() user: LoginDto) {
      return this.logger.log(user.email + ' logged in ' + new Date().toISOString());
    }

    @Post('/logout')
    @UseGuards(AuthenticatedGuard)
    public async logout(@Req() req: any) {
      try{
        req.session.destroy();
        return this.logger.log(req.user.email + ' logged out ' + new Date().toISOString());
      }catch(err){
        console.log(err)
        return err;
      }
    }

}
