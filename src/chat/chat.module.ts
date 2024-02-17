import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AIModule } from 'src/ai/ai.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    AIModule,AuthModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
