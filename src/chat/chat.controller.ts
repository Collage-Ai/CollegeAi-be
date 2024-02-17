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
export class ChatController {
  constructor(private readonly chatService:ChatService) {}

  @Post('storeMessage')
  create(@Body() chatDto: CreateChatDto) {
    console.log(chatDto);
    return this.chatService.storeMessage(chatDto.userId, chatDto.message, chatDto.sender);
  }
}
