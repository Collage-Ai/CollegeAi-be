import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AIModule } from 'src/ai/ai.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AIModule,AuthService],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
