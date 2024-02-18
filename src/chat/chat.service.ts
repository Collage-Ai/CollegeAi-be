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
    return this.chatRepository.find({
      where: { userId },
      order: { time: 'ASC' }, // 根据时间升序排序
    });
  }

  async updateMessage(chat: UpdateChatDto): Promise<Chat> {
    try {
      chat.time = new Date();
      //查找是否有id和userId相同的记录,如果有则更新,没有则插入
      const oldChat = await this.chatRepository.findOne({where:{id: chat.id,userId: chat.userId}});
      if (!oldChat) {
        return await this.chatRepository.save(chat);
      }else{
        await this.chatRepository.update(chat.id,chat);
        return this.chatRepository.findOne({where:{id: chat.id}});
      }
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async storeMessage({ userId, userMsg, aiMsg }: CreateChatDto): Promise<Chat> {
    const chat = new Chat();
    chat.userId = userId;
    chat.aiMsg = aiMsg;
    chat.userMsg = userMsg;
    chat.time = new Date();
    console.log(chat);
    try {
      return await this.chatRepository.save(chat);
    } catch (e) {
      console.log(e);
      //抛出异常
      throw new Error(e);
    }
  }
}
