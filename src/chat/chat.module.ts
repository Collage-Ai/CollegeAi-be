import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AIModule } from 'src/ai/ai.module';

@Module({
  imports: [AIModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
