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
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() chatDto: CreateChatDto) {
    console.log(chatDto);
    return this.chatService.storeMessage(chatDto);
  }

  @Get(':userId')
  getMessages(@Param('userId') userId: string) {
    return this.chatService.getMessagesForUser(+userId);
  }

  @Patch()
  update(@Body() chatDto: UpdateChatDto) {
    return this.chatService.updateMessage(chatDto);
  }
}
