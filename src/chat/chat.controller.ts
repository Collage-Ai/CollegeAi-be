import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/app.decorator';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class UserController {
  constructor(private readonly chatService:ChatService) {}

  @Public()
  @Post('storeMessage')
  create(@Body() chatDto: CreateChatDto) {
    return this.chatService.storeMessage(chatDto.userId, chatDto.message, chatDto.sender);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':name')
  // findOne(@Param('name') name: string) {
  //   return this.userService.findOne(name);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
