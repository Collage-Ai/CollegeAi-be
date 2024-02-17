import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    private aiService: AIService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    ) {}

  async getAIResponse(message: string): Promise<string> {
    // 调用AI模块获取响应
    const response = await this.aiService.getAIResponse(message);
    return response;
  }

  async getMessagesForUser(userId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { userId },
      order: { time: 'ASC' }, // 根据时间升序排序
    });
  }

  async storeMessage(userId: string, message: string, sender: string): Promise<Chat> {
    const chat = new Chat();
    chat.userId = userId;
    chat.message = message;
    chat.sender = sender;
    chat.time = new Date();
    console.log(chat);
    try {
      return await this.chatRepository.save(chat);
    }catch(e){
      console.log(e);
      //抛出异常
      throw new Error(e);
    }
    
  }
  
}
