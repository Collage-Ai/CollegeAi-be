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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  create(@Body() registerMsg:registerInfo) {
    //todo:验证短信验证码
    const createUserDto = new CreateUserDto();
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //获取短信验证码
  @Public()
  @Post('sendCode')
  sendCode(@Body() body) {
    return this.userService.sendCode(body);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
