import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/app.decorator';

@Controller('user')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('login', loginUserDto);
    const { phone, password } = loginUserDto;
    return this.AuthService.login(phone, password);
  }

  @Get('info')
  async getInfo(@Req() req) {
    const token = req.headers.authorization;
    return this.AuthService.getInfo(token);
  }
}
