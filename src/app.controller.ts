import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Render('login')
  @Get()
  public index(@Query('name') name?: string) {
    return { name };
  }

  @Render('about')
  @Get('/about')
  public about() {
    return {};
  }

  @Render('charts')
  @Get('/charts')
  public chart() {
    return {};
  }
  @Render('dashboard')
  @Get('/dashboard')
  public dashboard() {
    return {};
  }
}
