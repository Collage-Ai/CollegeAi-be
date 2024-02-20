import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

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

  async getMessagesForUser(userId: number): Promise<Chat[]> {
    try {
      console.log('userId', userId);
      return await this.chatRepository.find({
        where: { userId },
        order: { time: 'ASC' }, // 根据时间升序排序
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async updateMessage(chat: UpdateChatDto): Promise<Chat> {
    try {
      const chatToUpdate = await this.chatRepository.findOneBy({ id: chat.id} );
      if (!chatToUpdate) {
        throw new Error('消息不存在');
      }
      chatToUpdate.category = chat.category;
      chatToUpdate.time = new Date();
      return await this.chatRepository.save(chatToUpdate);
    }
    catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async storeMessage(createChatDto: CreateChatDto): Promise<Chat> {
    try {
      const chat = this.chatRepository.create(createChatDto);
      return await this.chatRepository.save(chat);
    }catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }  
}
