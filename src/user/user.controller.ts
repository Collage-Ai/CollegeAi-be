import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, registerInfo } from './dto/create-user.dto';
import { Public } from 'src/app.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
 async create(@Body() registerMsg:registerInfo) {
    //todo:验证短信验证码
    const createUserDto = await this.userService.verifyCode(registerMsg);
    return this.userService.create(createUserDto);
  }

  //获取短信验证码
  @Public()
  @Post('sendCode')
  sendCode(@Body() phone:string) {
    return this.userService.sendCode(phone);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @Public()
  @Post('search')
  search(@Body() body) {
    console.log(body)
    return this.userService.search(body);
  }
}
